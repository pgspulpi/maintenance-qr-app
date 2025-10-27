"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Upload, AlertCircle, ArrowLeft, Info, Copy, Check } from "lucide-react"
import Link from "next/link"
import QRCode from "qrcode"

interface MaintenanceItem {
  nombre: string
  codigo: string
}

export default function MaintenancePage() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [data, setData] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrData, setQrData] = useState<{ codigo: string; nombre: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isModalMounted, setIsModalMounted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleLoadData = async () => {
    setError("")
    setLoading(true)

    try {
      // Extract spreadsheet ID from URL
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (!match) {
        throw new Error("Invalid Google Sheets URL format")
      }

      const spreadsheetId = match[1]

      const gidMatch = sheetUrl.match(/[#&]gid=([0-9]+)/)
      const gid = gidMatch ? gidMatch[1] : "0"

      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`

      console.log("Fetching Google Sheets CSV:", csvUrl)

      const response = await fetch(csvUrl, {
        method: "GET",
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(
          "Failed to fetch spreadsheet. Please ensure:\n1. The sheet is set to 'Anyone with the link can view'\n2. The URL is correct\n3. The sheet contains 'Nombre' and 'Codigo' columns"
        )
      }

      const csvText = await response.text()
      const lines = csvText.split("\n").filter((line: string) => line.trim())

      // Skip header row and parse data
      const parsedData: MaintenanceItem[] = []
      for (let i = 1; i < lines.length; i++) {
        const [nombre, codigo] = lines[i].split(",").map((cell: string) => cell.trim().replace(/^"|"$/g, ""))
        if (nombre && codigo) {
          parsedData.push({ nombre, codigo })
        }
      }

      if (parsedData.length === 0) {
        throw new Error("No data found. Make sure your sheet has 'Nombre' and 'Codigo' columns with data.")
      }

      setData(parsedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQR = (codigo: string, nombre: string) => {
    setQrData({ codigo, nombre })
    setQrModalOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setQrModalOpen(open)
    if (!open) {
      setIsModalMounted(false)
    }
  }

  useEffect(() => {
    if (qrModalOpen && qrData && isModalMounted) {
      console.log('Generating QR code for:', qrData)
      
      if (canvasRef.current) {
        const qrContent = JSON.stringify(qrData)
        
        QRCode.toCanvas(canvasRef.current, qrContent, {
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        }).then(() => {
          console.log('QR code generated successfully')
        }).catch((err) => {
          console.error('Failed to generate QR code:', err)
        })
      }
    }
  }, [qrModalOpen, qrData, isModalMounted])

  const copyQRToClipboard = async () => {
    if (!canvasRef.current) return

    try {
      const canvas = canvasRef.current
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch (err) {
      console.error('Failed to copy QR code:', err)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cargar Datos de Google Sheets
            </CardTitle>
            <CardDescription>
              Ingresa la URL de tu documento de Google Sheets. Asegúrate de que sea públicamente accesible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sheet-url">URL de la Hoja de Cálculo de Google</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>
              
              {showInstructions && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Cómo compartir tu hoja de cálculo:</strong>
                    <ol className="mt-2 ml-4 list-decimal space-y-1">
                      <li>Abre tu Hoja de Cálculo de Google</li>
                      <li>Haz clic en el botón "Compartir" (arriba a la derecha)</li>
                      <li>Cambia a "Cualquiera con el enlace" puede ver</li>
                      <li>Copia y pega la URL aquí</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              )}

              <Input
                id="sheet-url"
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              <Button onClick={handleLoadData} disabled={loading || !sheetUrl}>
                {loading ? "Loading..." : "Load Data"}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lista de invitados</CardTitle>
              <CardDescription>{data.length} invitados cargados. Haz clic en el botón QR para generar un código.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Codigo</TableHead>
                      <TableHead className="text-right">QR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.nombre}</TableCell>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleGenerateQR(item.codigo, item.nombre)}>
                            <QrCode className="mr-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={qrModalOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR de Invitado</DialogTitle>
            <DialogDescription>
              Escanea este código para ver la información del invitado
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <canvas 
              key={`${qrData?.codigo}-${qrData?.nombre}`}
              ref={(node) => {
                canvasRef.current = node
                if (node && !isModalMounted) {
                  setIsModalMounted(true)
                }
              }} 
              width={400} 
              height={400} 
              className="rounded-lg border-2 border-border" 
            />
            {qrData && (
              <>
                <div className="text-center space-y-2 w-full">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre:</p>
                    <p className="text-lg font-semibold">{qrData.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Código:</p>
                    <p className="text-lg font-mono font-semibold">{qrData.codigo}</p>
                  </div>
                </div>
                <Button 
                  onClick={copyQRToClipboard} 
                  variant="default"
                  className={`w-full ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Código QR
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

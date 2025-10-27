"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Upload, AlertCircle, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

interface MaintenanceItem {
  nombre: string
  codigo: string
}

export default function MaintenancePage() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [data, setData] = useState<MaintenanceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    const qrUrl = `/qr#${encodeURIComponent(JSON.stringify({ "codigo": codigo, "nombre": nombre }))}`
    window.open(qrUrl, "_blank")
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

              <div className="space-y-2">
                <Label htmlFor="sheet-url">URL de la Hoja de Cálculo de Google</Label>
                <Input
                  id="sheet-url"
                  type="url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                />
              </div>
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
    </main>
  )
}

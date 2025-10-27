"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

export default function QRCodePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Get code from URL hash
    const hash = window.location.hash.substring(1)
    const decodedCode = decodeURIComponent(hash)
    if (decodedCode) {
      setCode(decodedCode)
    }
  }, [])

  useEffect(() => {
    if (canvasRef.current && code) {
      QRCode.toCanvas(canvasRef.current, code, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    }
  }, [code])

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

  if (!code) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Código QR de invitado</CardTitle>
            <CardDescription>URL de código QR inválido</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Link href="/maintenance">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Código QR de invitado</CardTitle>
          <CardDescription>Escanea este código para ver la información del invitado</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className="rounded-lg border-2 border-border" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Codigo:</p>
            <p className="text-lg font-mono font-semibold">{code}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={copyQRToClipboard} 
              variant="default"
              className={copied ? "bg-green-600 hover:bg-green-700" : ""}
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
            <Link href="/maintenance">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


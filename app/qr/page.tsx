"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function QRCodePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
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

  if (!code) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Equipment QR Code</CardTitle>
            <CardDescription>Invalid QR code URL</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Link href="/maintenance">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Maintenance
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
          <CardTitle>Equipment QR Code</CardTitle>
          <CardDescription>Scan this code to view equipment information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className="rounded-lg border-2 border-border" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Code:</p>
            <p className="text-lg font-mono font-semibold">{code}</p>
          </div>
          <Link href="/maintenance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Maintenance
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}


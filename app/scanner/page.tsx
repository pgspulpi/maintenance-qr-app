"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScanLine, CheckCircle, ArrowLeft, Camera } from "lucide-react"
import Link from "next/link"

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedCode, setScannedCode] = useState<any>(null)
  const [error, setError] = useState("")
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const startScanning = async () => {
    setError("")
    setScannedCode(null)
    setScanning(true) // Set scanning state first so element is visible

    try {
      console.log("[v0] Requesting camera permissions...")

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setScanning(false)
        throw new Error(
          "Camera not supported in this browser. Please use a modern browser like Chrome, Safari, or Firefox.",
        )
      }

      // Wait a bit for React to render the element
      await new Promise(resolve => setTimeout(resolve, 100))

      const element = document.getElementById("qr-reader")
      if (!element) {
        setScanning(false)
        throw new Error("Scanner element not found in DOM")
      }

      const html5QrCode = new Html5Qrcode("qr-reader")
      scannerRef.current = html5QrCode

      console.log("[v0] Starting camera with environment facing mode...")

      // Try to start with back camera first
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log("[v0] QR Code scanned:", decodedText)
            try {
              const data = JSON.parse(decodedText)
              console.log("[v0] Data:", data)
              // Validate that the parsed data has "codigo" and "nombre" fields
              if (typeof data !== "object" || data === null || !("codigo" in data) || !("nombre" in data)) {
                throw new Error("Invalid QR code data: missing 'codigo' or 'nombre' field")
              }
              setScannedCode(data)
            } catch {
              setScannedCode(decodedText)
            }
            stopScanning()
          },
          () => {
            // Error callback - ignore individual frame errors
          },
        )
        console.log("[v0] Camera started successfully with back camera")
      } catch (backCameraError) {
        console.log("[v0] Back camera failed, trying any available camera...")
        // If back camera fails, try any available camera
        await html5QrCode.start(
          { facingMode: "user" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log("[v0] QR Code scanned:", decodedText)
            setScannedCode(decodedText)
            stopScanning()
          },
          () => {
            // Error callback - ignore individual frame errors
          },
        )
        console.log("[v0] Camera started successfully with front camera")
      }

    } catch (err) {
      setScanning(false)
      console.error("[v0] Camera error:", err)

      let errorMessage = "Failed to start camera. "

      if (err instanceof Error) {
        if (err.message.includes("Permission denied") || err.message.includes("NotAllowedError")) {
          errorMessage += "Please allow camera access in your browser settings."
        } else if (err.message.includes("NotFoundError") || err.message.includes("not found")) {
          errorMessage += "No camera found on this device."
        } else if (err.message.includes("NotReadableError")) {
          errorMessage += "Camera is already in use by another application."
        } else if (err.message.includes("OverconstrainedError")) {
          errorMessage += "Camera doesn't support the requested settings."
        } else {
          errorMessage += err.message
        }
      }

      setError(errorMessage)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        // Check if scanner is actually running before stopping
        const state = scannerRef.current.getState()
        if (state === 2 || state === 3) {
          // 2 = SCANNING, 3 = PAUSED
          await scannerRef.current.stop()
        }
        scannerRef.current.clear()
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
    setScanning(false)
    setError("") // Clear any errors when stopping
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        stopScanning()
      }
    }
  }, [scanning])

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-accent/10 p-4">
                <ScanLine className="h-8 w-8 text-accent" />
              </div>
            </div>
            <CardTitle>Escáner de Código QR</CardTitle>
            <CardDescription>Escanea el código QR para ver los datos del invitado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={scanning ? "space-y-4" : "hidden"}>
              <div id="qr-reader" className="w-full overflow-hidden rounded-lg border-2 border-accent shadow-lg" />
              <div className="flex justify-center">
                <Button onClick={stopScanning} variant="outline" size="lg">
                  Detener Escaneo
                </Button>
              </div>
            </div>

            {!scanning && !scannedCode && (
              <div className="space-y-4">
                <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10">
                  <div className="text-center">
                    <Camera className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Vista previa de la cámara aquí</p>
                  </div>
                </div>
                <div id="qr-reader" className="hidden" />
                <div className="flex justify-center">
                  <Button onClick={startScanning} size="lg">
                    <ScanLine className="mr-2 h-5 w-5" />
                    Iniciar Escaneo
                  </Button>
                </div>
              </div>
            )}

            {scannedCode && (
              <div className="space-y-6">
                <Alert className="border-2 border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-green-700 dark:text-green-400">Escaneo de código QR con éxito!</p>
                    </div>
                  </AlertDescription>
                </Alert>
                
                <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
                  <div className="bg-primary/10 px-6 py-4">
                    <h3 className="text-lg font-semibold tracking-wide text-primary">Invitado</h3>
                  </div>
                  <div className="space-y-6 p-8">
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-4">
                        <div className="flex flex-col items-center space-y-8 w-full">
                          <div className="w-full flex justify-center">
                            <Card className="w-full max-w-xs p-6 bg-accent/10 border-accent/30 shadow-none">
                              <div className="text-center">
                                <span className="block text-lg font-semibold text-muted-foreground uppercase mb-2">Nombre</span>
                                <p className="text-2xl font-bold text-primary">{scannedCode?.nombre || "N/A"}</p>
                              </div>
                            </Card>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <span className="block text-xl font-bold text-primary uppercase tracking-wide mb-3">Código</span>
                            <p className="break-all font-mono text-4xl font-extrabold text-primary text-center">{scannedCode?.codigo || scannedCode || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button onClick={() => setScannedCode(null)} size="lg" className="w-full md:w-auto">
                    <ScanLine className="mr-2 h-5 w-5" />
                    Escanear otro código
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

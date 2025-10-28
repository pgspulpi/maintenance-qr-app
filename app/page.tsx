import Link from "next/link"
import pkg from "../package.json"
import { QrCode, ScanLine, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary p-4">
              <img src="/pumpkin.png" alt="Pumpkin" className="h-8 w-8 object-contain" />
            </div>
          </div>
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">Adrian's halloween party</h1>
          <p className="text-sm text-muted-foreground">v{pkg.version}</p>
          <p className="text-pretty text-muted-foreground">
            Gestiona los códigos de invitados y escanea los códigos QR
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
        <Link href="/scanner" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <ScanLine className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Escáner de Código QR</CardTitle>
                <CardDescription>Escanea códigos QR para ver los códigos de invitados y la información de mantenimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Abrir Escáner
                </Button>
              </CardContent>
            </Card>
          </Link>
          <Link href="/maintenance" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Gestión de Invitados</CardTitle>
                <CardDescription>Importa datos desde Google Sheets y genera códigos QR para invitados</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Abrir Gestión de Invitados</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}

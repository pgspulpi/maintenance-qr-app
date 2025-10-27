import Link from "next/link"
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
              <Wrench className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight md:text-4xl">Maintenance Manager</h1>
          <p className="text-pretty text-muted-foreground">
            Manage equipment codes and scan QR codes for maintenance tracking
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/maintenance" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Maintenance Page</CardTitle>
                <CardDescription>Import data from Google Sheets and generate QR codes for equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Open Maintenance</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/scanner" className="block">
            <Card className="h-full transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <ScanLine className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>QR Scanner</CardTitle>
                <CardDescription>Scan QR codes to view equipment codes and maintenance information</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Open Scanner
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function InitBundlesPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const initializeTables = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/bundles/init", {
        method: "POST",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to initialize tables")
      }

      setSuccess("Bundle tables created successfully!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Initialize Bundle Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Before you can manage bundles, you need to create the necessary database tables. Click the button below to
            initialize the bundle tables.
          </p>

          {error && <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-800 text-sm">{error}</div>}

          {success && (
            <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-800 text-sm">{success}</div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 w-full">
            <Button onClick={initializeTables} className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? "Initializing..." : "Initialize Tables"}
            </Button>
            {success && (
              <Button asChild variant="outline" className="flex-1">
                <Link href="/admin/bundles">Go to Bundles</Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

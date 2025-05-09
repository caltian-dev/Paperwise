"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function DocumentVerification() {
  const [url, setUrl] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<{
    exists: boolean
    contentType?: string
    size?: number
    error?: string
  } | null>(null)

  const verifyDocument = async () => {
    if (!url) return

    setIsVerifying(true)
    setResult(null)

    try {
      // Try to fetch the document
      const response = await fetch(url, { method: "HEAD" })

      if (response.ok) {
        setResult({
          exists: true,
          contentType: response.headers.get("content-type") || undefined,
          size: Number.parseInt(response.headers.get("content-length") || "0", 10) || undefined,
        })
      } else {
        setResult({
          exists: false,
          error: `Document not accessible (Status: ${response.status})`,
        })
      }
    } catch (err: any) {
      setResult({
        exists: false,
        error: err.message || "Failed to verify document",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">Enter a document URL to verify that it exists and is accessible.</p>

        <div className="space-y-2">
          <Label htmlFor="documentUrl">Document URL</Label>
          <div className="flex gap-2">
            <Input
              id="documentUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="flex-1"
            />
            <Button onClick={verifyDocument} disabled={!url || isVerifying} className="bg-teal-600 hover:bg-teal-700">
              {isVerifying ? "Checking..." : "Verify"}
            </Button>
          </div>
        </div>

        {result && (
          <div
            className={`p-4 rounded-md ${
              result.exists ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.exists ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${result.exists ? "text-green-800" : "text-red-800"}`}>
                  {result.exists ? "Document is accessible" : "Document is not accessible"}
                </p>
                {result.exists ? (
                  <ul className="mt-2 space-y-1 text-sm text-green-700">
                    <li>Type: {result.contentType || "Unknown"}</li>
                    {result.size && <li>Size: {formatBytes(result.size)}</li>}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-red-700">{result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          CORS may prevent verification of some URLs
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open(url, "_blank")} disabled={!url}>
          <FileText className="h-4 w-4 mr-1" />
          Open URL
        </Button>
      </CardFooter>
    </Card>
  )
}

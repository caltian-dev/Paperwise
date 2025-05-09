"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw } from "lucide-react"

export default function GenerateCronSecret() {
  const [secret, setSecret] = useState("")
  const [copied, setCopied] = useState(false)

  // Generate a random string on component mount
  useEffect(() => {
    generateSecret()
  }, [])

  // Function to generate a random string
  const generateSecret = () => {
    const length = 32
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setSecret(result)
    setCopied(false)
  }

  // Function to copy the secret to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Generate CRON_SECRET</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>CRON_SECRET Generator</CardTitle>
          <CardDescription>
            Generate a secure random string to use as your CRON_SECRET environment variable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={secret} readOnly className="font-mono" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={generateSecret} title="Generate new secret">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {copied && <p className="text-sm text-green-600">Copied to clipboard!</p>}

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Copy the generated secret above</li>
              <li>
                Add it to your Vercel project as an environment variable named{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">CRON_SECRET</code>
              </li>
              <li>Set up a cron job to hit your endpoint with this secret in the Authorization header</li>
              <li>
                Example header:{" "}
                <code className="bg-gray-200 px-1 py-0.5 rounded">Authorization: Bearer YOUR_SECRET_HERE</code>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

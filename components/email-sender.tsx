"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function EmailSender() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    html: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.to || !formData.to.includes("@")) {
      setResult({
        success: false,
        message: "Please enter a valid email address",
      })
      return
    }

    if (!formData.html) {
      setResult({
        success: false,
        message: "Email content is required",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message,
      })

      if (data.success) {
        setFormData({
          to: "",
          subject: "",
          html: "",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Something went wrong. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {result && (
        <Alert
          variant={result.success ? "default" : "destructive"}
          className={result.success ? "bg-teal-50 text-teal-800 border-teal-200" : ""}
        >
          {result.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Email
          </label>
          <Input
            id="to"
            name="to"
            type="email"
            placeholder="recipient@example.com"
            value={formData.to}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            id="subject"
            name="subject"
            type="text"
            placeholder="Email Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="html" className="block text-sm font-medium text-gray-700 mb-1">
            Email Content (HTML)
          </label>
          <Textarea
            id="html"
            name="html"
            placeholder="<p>Your email content here...</p>"
            value={formData.html}
            onChange={handleChange}
            required
            className="min-h-[200px]"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Email"
          )}
        </Button>
      </form>
    </div>
  )
}

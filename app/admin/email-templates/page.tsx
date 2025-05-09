"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HtmlEmailEditor } from "@/components/html-email-editor"
import { TestEmailSender } from "@/components/test-email-sender"
import Link from "next/link"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  description?: string
  last_updated?: string
}

export default function EmailTemplatesAdmin() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    checkInitialization()
  }, [])

  const checkInitialization = async () => {
    try {
      const response = await fetch("/api/email-templates/init")
      const data = await response.json()

      if (data.success) {
        setInitialized(true)
        fetchTemplates()
      } else {
        setError("Failed to initialize email templates")
      }
    } catch (error) {
      console.error("Error initializing templates:", error)
      setError("Failed to initialize email templates")
    }
  }

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/email-templates")
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
        if (data.templates.length > 0 && !activeTemplate) {
          setActiveTemplate(data.templates[0].id)
        }
        setError("")
      } else {
        setError(data.error || "Failed to fetch templates")
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      setError("Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString()
  }

  if (!initialized) {
    return (
      <div className="container mx-auto py-10">
        <Alert className="mb-6">
          <AlertTitle>Database tables not initialized</AlertTitle>
          <AlertDescription>The email templates system needs to be initialized before use.</AlertDescription>
        </Alert>
        <Button onClick={checkInitialization} className="mt-4">
          Initialize Email Templates
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <Button variant="outline" onClick={fetchTemplates}>
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div>Loading templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Template Library</CardTitle>
                <CardDescription>Select a template to edit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={activeTemplate === template.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveTemplate(template.id)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {activeTemplate && (
              <div className="mt-6">
                <TestEmailSender
                  templateId={activeTemplate}
                  templateName={templates.find((t) => t.id === activeTemplate)?.name || "Email"}
                />
              </div>
            )}

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Help & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="https://www.markdownguide.org/basic-syntax/"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        HTML Email Best Practices
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/onboarding" className="text-blue-600 hover:underline">
                        Manage Onboarding Sequences
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin" className="text-blue-600 hover:underline">
                        Back to Admin Dashboard
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-3">
            {activeTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Template: {templates.find((t) => t.id === activeTemplate)?.name}</CardTitle>
                  <CardDescription>Customize the content and appearance of this email template</CardDescription>
                </CardHeader>
                <CardContent>
                  <HtmlEmailEditor templateId={activeTemplate} onSave={fetchTemplates} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  Select a template from the library to edit
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

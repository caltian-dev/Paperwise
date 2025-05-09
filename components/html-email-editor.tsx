"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  description?: string
  last_updated?: string
}

interface HtmlEmailEditorProps {
  templateId: string
  onSave?: () => void
}

export function HtmlEmailEditor({ templateId, onSave }: HtmlEmailEditorProps) {
  const [template, setTemplate] = useState<EmailTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/email-templates/${templateId}`)
      const data = await response.json()

      if (data.success) {
        setTemplate(data.template)
        setError("")
      } else {
        setError(data.error || "Failed to fetch template")
      }
    } catch (error) {
      console.error("Error fetching template:", error)
      setError("Failed to fetch template")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EmailTemplate, value: string) => {
    if (template) {
      setTemplate({
        ...template,
        [field]: value,
      })
    }
  }

  const saveTemplate = async () => {
    if (!template) return

    setSaving(true)
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: template.name,
          subject: template.subject,
          html_content: template.html_content,
          description: template.description,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Email template saved successfully",
        })
        if (onSave) onSave()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save template",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const resetTemplate = () => {
    fetchTemplate()
    toast({
      title: "Reset",
      description: "Template has been reset to the last saved version",
    })
  }

  if (loading) {
    return <div>Loading template...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input id="name" value={template.name} onChange={(e) => handleInputChange("name", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Email Subject</Label>
          <Input id="subject" value={template.subject} onChange={(e) => handleInputChange("subject", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={template.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe when this template is used..."
          rows={2}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit HTML</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-4">
          <Textarea
            value={template.html_content}
            onChange={(e) => handleInputChange("html_content", e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Edit the HTML content of your email template. You can use variables like {"{userName}"} that will be
            replaced when the email is sent.
          </p>
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="border rounded-md p-4">
                <div className="text-sm font-medium mb-2">Subject: {template.subject}</div>
                <div className="border-t pt-2">
                  <iframe
                    srcDoc={template.html_content}
                    className="w-full min-h-[500px] border-0"
                    title="Email Preview"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={resetTemplate} disabled={saving}>
          Reset
        </Button>
        <Button onClick={saveTemplate} disabled={saving}>
          {saving ? "Saving..." : "Save Template"}
        </Button>
      </div>

      {template.last_updated && (
        <p className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(template.last_updated).toLocaleString()}
        </p>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface BlogPostEditorProps {
  value: string
  onChange: (value: string) => void
}

export function BlogPostEditor({ value, onChange }: BlogPostEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("write")
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTab === "preview" && previewRef.current) {
      previewRef.current.innerHTML = markdownToHtml(value)
    }
  }, [activeTab, value])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const markdownToHtml = (markdown: string) => {
    // This is a very basic markdown to HTML converter
    // In a production app, you'd want to use a proper markdown library
    const html = markdown
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      // Links
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^\s*\n\* (.*)/gim, "<ul>\n<li>$1</li>\n</ul>")
      .replace(/^\s*\n\d+\. (.*)/gim, "<ol>\n<li>$1</li>\n</ol>")
      // Paragraphs
      .replace(/^\s*(\n)?(.+)/gim, (m) => (/<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : "<p>" + m + "</p>"))
      // Line breaks
      .replace(/\n/gim, "<br />")

    return html
  }

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="write" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="border-b rounded-none">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your post content here... Use markdown for formatting."
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0"
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4">
          <div ref={previewRef} className="prose prose-gray max-w-none min-h-[400px]" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

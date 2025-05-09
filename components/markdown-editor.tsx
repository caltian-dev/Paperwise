"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  label = "Content",
  placeholder = "Enter content here...",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("edit")

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Use Markdown for formatting: **bold**, *italic*, # Heading, ## Subheading, - list item, etc.
          </p>
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="border rounded-md p-4 min-h-[400px] prose prose-sm max-w-none">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Preview will appear here...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

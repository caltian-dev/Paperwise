"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface CsvPriceTemplateGeneratorProps {
  filenames?: string[]
  includeCategories?: boolean
  onGenerated?: () => void
}

export function CsvPriceTemplateGenerator({
  filenames = [],
  includeCategories = true,
  onGenerated,
}: CsvPriceTemplateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateTemplate = () => {
    setIsGenerating(true)

    try {
      // Create header row
      const headers = ["filename", "price"]
      if (includeCategories) headers.push("category")

      // Create data rows
      const rows =
        filenames.length > 0
          ? filenames.map((filename) => {
              const row = [filename, ""]
              if (includeCategories) row.push("")
              return row
            })
          : [
              ["example-document.pdf", "19.99"],
              ["another-document.docx", "29.99"],
            ]

      // Combine headers and rows
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "document_pricing_template.csv"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      if (onGenerated) onGenerated()
    } catch (error) {
      console.error("Error generating CSV template:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={generateTemplate} disabled={isGenerating}>
      <Download className="h-4 w-4 mr-2" />
      {isGenerating ? "Generating..." : "Download CSV Template"}
    </Button>
  )
}

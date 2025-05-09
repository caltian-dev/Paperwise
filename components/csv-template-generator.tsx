"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { useState, useEffect } from "react"

export function CsvTemplateGenerator() {
  const [bundles, setBundles] = useState<any[]>([])

  useEffect(() => {
    // Fetch bundles when component mounts
    const fetchBundles = async () => {
      try {
        const response = await fetch("/api/bundles")
        if (response.ok) {
          const data = await response.json()
          setBundles(data.bundles || [])
        }
      } catch (error) {
        console.error("Error fetching bundles:", error)
      }
    }

    fetchBundles()
  }, [])

  const generateCsvTemplate = () => {
    // Create bundle IDs string for the example
    const bundleIds =
      bundles.length > 0
        ? bundles
            .slice(0, 2)
            .map((b) => b.id)
            .join(";")
        : "bundle_id1;bundle_id2"

    // CSV header and example rows
    const csvContent = [
      "name,description,price,category,format,url,bundleIds",
      `LLC Operating Agreement,Essential agreement that outlines ownership structure and operating procedures,49,business,pdf,https://drive.google.com/file/d/EXAMPLE_ID/view,${bundleIds}`,
      "Privacy Policy,GDPR compliant privacy policy for websites,29,website,docx,https://drive.google.com/file/d/ANOTHER_EXAMPLE_ID/view,",
      "Independent Contractor Agreement,Standard agreement for hiring contractors,39,contracts,pdf,,",
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "document-upload-template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={generateCsvTemplate} className="flex items-center gap-2">
      <FileDown className="h-4 w-4" />
      Download CSV Template
    </Button>
  )
}

"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { StreamlinedDocumentUpload } from "@/components/streamlined-document-upload"

export default function StreamlinedUploadPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Streamlined Document Upload</h1>
      </div>

      <StreamlinedDocumentUpload />
    </div>
  )
}

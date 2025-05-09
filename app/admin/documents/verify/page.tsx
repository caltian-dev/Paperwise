"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DocumentVerification } from "@/components/document-verification"

export default function VerifyDocumentPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Document Verification</h1>

      <div className="max-w-2xl mx-auto">
        <DocumentVerification />
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { GoogleDriveValidator } from "@/components/google-drive-validator"

export default function GoogleDriveValidatorPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Google Drive URL Validator</h1>

      <div className="max-w-2xl mx-auto">
        <GoogleDriveValidator />

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">How to Use Google Drive for Document Hosting</h2>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 1: Upload Your Document to Google Drive</h3>
            <p className="text-sm text-gray-600">Upload your PDF or DOCX file to your Google Drive account.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 2: Set Sharing Permissions</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Right-click on the file in Google Drive</li>
              <li>Select "Share"</li>
              <li>Click on "Change to anyone with the link"</li>
              <li>Make sure it's set to "Viewer"</li>
              <li>Click "Done"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 3: Get the Link</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Right-click on the file again</li>
              <li>Select "Get link"</li>
              <li>Copy the link</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 4: Validate the Link</h3>
            <p className="text-sm text-gray-600">
              Paste the link in the validator above to check if it's accessible and get the direct download URL.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Step 5: Use in CSV Upload</h3>
            <p className="text-sm text-gray-600">
              Add the Google Drive URL to the "url" column in your CSV file for document uploads.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
            <h4 className="font-medium text-blue-800 mb-1">Benefits of Using Google Drive</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>No need to upload files directly to the platform</li>
              <li>Leverage Google Drive's storage and reliability</li>
              <li>Easily update documents by replacing them in Google Drive</li>
              <li>Maintain control over your documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

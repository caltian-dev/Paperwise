import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CsvPriceTemplateGenerator } from "@/components/csv-price-template-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CsvPricingGuidePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <Link href="/admin/documents" className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CSV Pricing Guide</h1>
        <CsvPriceTemplateGenerator />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Use CSV Import for Document Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The CSV import feature allows you to quickly set prices and categories for multiple documents at once.
              Follow these steps to use this feature:
            </p>

            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Download the template</strong> - Click the "Download CSV Template" button to get a CSV file with
                the correct format.
              </li>
              <li>
                <strong>Fill in the data</strong> - Open the CSV file in a spreadsheet program like Excel or Google
                Sheets. Fill in the price and category columns for each document.
              </li>
              <li>
                <strong>Save as CSV</strong> - Save the file as a CSV file when you're done editing.
              </li>
              <li>
                <strong>Import the CSV</strong> - In the Streamlined Upload page, click "Import CSV" and select your
                saved CSV file.
              </li>
            </ol>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
              <h3 className="font-medium text-amber-800 mb-2">Important Notes</h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-700">
                <li>
                  The <strong>filename</strong> column must match the exact filename of your uploaded documents or
                  contain the filename without extension.
                </li>
                <li>
                  The <strong>price</strong> column should contain numeric values only (e.g., 19.99).
                </li>
                <li>
                  The <strong>category</strong> column should contain one of the predefined categories: business,
                  contracts, employment, realestate, website.
                </li>
                <li>You can leave cells empty if you don't want to update that particular field.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {`filename,price,category
business-contract.pdf,19.99,contracts
employee-handbook.docx,29.99,employment
privacy-policy.pdf,14.99,website`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

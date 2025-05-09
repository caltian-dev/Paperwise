import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { executeQuery } from "@/lib/db"

async function getDisclaimer() {
  try {
    // Check if the legal_documents table exists
    const tableCheck = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'legal_documents'
      );
    `)

    const tableExists = tableCheck[0].exists

    if (!tableExists) {
      return null
    }

    // Fetch the disclaimer
    const documents = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = 'disclaimer';`)

    if (documents.length === 0) {
      return null
    }

    return documents[0]
  } catch (error) {
    console.error("Error fetching disclaimer:", error)
    return null
  }
}

export default async function Disclaimer() {
  const disclaimer = await getDisclaimer()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-center">
              {disclaimer?.title || "Legal Disclaimer"}
            </h1>
            {disclaimer?.lastUpdated && <p className="text-center mb-8">Last Update: {disclaimer.lastUpdated}</p>}

            {disclaimer?.pdfUrl ? (
              <div className="w-full aspect-[8.5/11] min-h-[800px]">
                <iframe
                  src={`${disclaimer.pdfUrl}#view=FitH`}
                  className="w-full h-full border-0"
                  title="Disclaimer PDF"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                {/* Default disclaimer content */}
                <p className="text-lg mb-6">
                  Effective Date:{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <h2>1. No Legal Advice</h2>
                <p>Templates are for informational purposes and do not constitute legal advice.</p>

                {/* Rest of the default disclaimer content */}
                <h2>2. No Attorney-Client Relationship</h2>
                <p>Your use of this site does not form an attorney-client relationship.</p>

                <h2>3. Use at Your Own Risk</h2>
                <p>You are responsible for ensuring the templates suit your needs.</p>

                <h2>4. Limitation of Liability</h2>
                <p>We are not responsible for any damages from use of our templates.</p>

                <h2>5. Updates</h2>
                <p>
                  We may revise content. It is your responsibility to ensure you are using the most current version.
                </p>
                <p className="text-gray-500 italic mt-8">
                  Note: Upload your disclaimer PDF in the admin area to replace this default content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

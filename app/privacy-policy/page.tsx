import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { executeQuery } from "@/lib/db"

async function getPrivacyPolicy() {
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

    // Fetch the privacy policy
    const documents = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = 'privacy-policy';`)

    if (documents.length === 0) {
      return null
    }

    return documents[0]
  } catch (error) {
    console.error("Error fetching privacy policy:", error)
    return null
  }
}

export default async function PrivacyPolicy() {
  const privacyPolicy = await getPrivacyPolicy()

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
              {privacyPolicy?.title || "Privacy Policy"}
            </h1>
            {privacyPolicy?.lastUpdated && <p className="text-center mb-8">Last Update: {privacyPolicy.lastUpdated}</p>}

            {privacyPolicy?.pdfUrl ? (
              <div className="w-full aspect-[8.5/11] min-h-[800px]">
                <iframe
                  src={`${privacyPolicy.pdfUrl}#view=FitH`}
                  className="w-full h-full border-0"
                  title="Privacy Policy PDF"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
                <p>
                  This Privacy Policy explains how Jibeset Management LLC d/b/a Paperwise ("we," "us," or "our")
                  collects, uses, and shares information about users ("you" or "your") when you use our Website.
                </p>

                {/* Rest of the default privacy policy content */}
                <p className="text-gray-500 italic mt-8">
                  Note: Upload your privacy policy PDF in the admin area to replace this default content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { executeQuery } from "@/lib/db"

async function getTermsOfService() {
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

    // Fetch the terms of service
    const documents = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = 'terms-of-service';`)

    if (documents.length === 0) {
      return null
    }

    return documents[0]
  } catch (error) {
    console.error("Error fetching terms of service:", error)
    return null
  }
}

export default async function TermsOfService() {
  const termsOfService = await getTermsOfService()

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
              {termsOfService?.title || "Terms and Conditions"}
            </h1>
            {termsOfService?.lastUpdated && (
              <p className="text-center mb-8">Last Update: {termsOfService.lastUpdated}</p>
            )}

            {termsOfService?.pdfUrl ? (
              <div className="w-full aspect-[8.5/11] min-h-[800px]">
                <iframe
                  src={`${termsOfService.pdfUrl}#view=FitH`}
                  className="w-full h-full border-0"
                  title="Terms of Service PDF"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                {/* Default terms of service content */}
                <p className="text-lg mb-6">
                  Effective Date:{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <h2>1. Use of the Service</h2>
                <p>
                  Paperwise provides downloadable, attorney-drafted legal templates for small businesses, freelancers,
                  and entrepreneurs. You must be at least 18 years old to use our Service.
                </p>

                <h2>2. Account Registration</h2>
                <p>
                  You may be required to create an account. You agree to provide accurate, current, and complete
                  information and to keep your login credentials secure.
                </p>

                <h2>3. Purchases and Payment</h2>
                <p>
                  Payments are securely processed by third parties (e.g., Stripe). All purchases are final due to the
                  digital nature of our products.
                </p>

                <h2>4. License to Use Templates</h2>
                <p>You receive a non-exclusive, non-transferable license for personal business use only.</p>

                <h2>5. Intellectual Property</h2>
                <p>All content is owned by Paperwise and protected by intellectual property laws.</p>

                <h2>6. Legal Disclaimer</h2>
                <p>Templates do not constitute legal advice and do not create an attorney-client relationship.</p>

                <h2>7. Limitation of Liability</h2>
                <p>We are not liable for indirect or consequential damages. Liability is limited to the amount paid.</p>

                <h2>8. Termination</h2>
                <p>We may suspend or terminate accounts at our discretion.</p>

                <h2>9. Privacy and Data Protection</h2>
                <p>Your use is subject to our Privacy Policy in compliance with GDPR and CCPA.</p>

                <h2>10. Governing Law</h2>
                <p>Governed by the laws of the State of Illinois.</p>

                <h2>11. Changes</h2>
                <p>We may update these Terms at any time. Continued use means acceptance.</p>

                <h2>12. Contact</h2>
                <p>[Insert Email Address]</p>

                <p className="text-gray-500 italic mt-8">
                  Note: Upload your terms of service PDF in the admin area to replace this default content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

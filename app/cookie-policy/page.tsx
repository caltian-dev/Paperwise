import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { executeQuery } from "@/lib/db"

async function getCookiePolicy() {
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

    // Fetch the cookie policy
    const documents = await executeQuery(`SELECT * FROM "legal_documents" WHERE "id" = 'cookie-policy';`)

    if (documents.length === 0) {
      return null
    }

    return documents[0]
  } catch (error) {
    console.error("Error fetching cookie policy:", error)
    return null
  }
}

export default async function CookiePolicy() {
  const cookiePolicy = await getCookiePolicy()

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
              {cookiePolicy?.title || "Cookie Policy"}
            </h1>
            {cookiePolicy?.lastUpdated && <p className="text-center mb-8">Last Update: {cookiePolicy.lastUpdated}</p>}

            {cookiePolicy?.pdfUrl ? (
              <div className="w-full aspect-[8.5/11] min-h-[800px]">
                <iframe
                  src={`${cookiePolicy.pdfUrl}#view=FitH`}
                  className="w-full h-full border-0"
                  title="Cookie Policy PDF"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                {/* Default cookie policy content */}
                <p className="text-lg mb-6">
                  Effective Date:{" "}
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <h2>1. What Are Cookies?</h2>
                <p>Small data files stored on your device when you visit our website.</p>

                <h2>2. Why We Use Them</h2>
                <p>To operate the website, analyze usage, personalize content, and remember preferences.</p>

                <h2>3. Types We Use</h2>
                <ul>
                  <li>Essential Cookies</li>
                  <li>Analytics Cookies (Google Analytics)</li>
                  <li>Functional Cookies</li>
                </ul>

                <h2>4. Control Cookies</h2>
                <p>Manage in your browser settings or through a cookie consent tool.</p>

                <h2>5. Third-Party Cookies</h2>
                <p>We may use Google Analytics. Refer to their policies for more info.</p>

                <h2>6. Updates</h2>
                <p>We may revise this policy over time.</p>

                <h2>7. Contact</h2>
                <p>[Insert Email Address]</p>

                <p className="text-gray-500 italic mt-8">
                  Note: Upload your cookie policy PDF in the admin area to replace this default content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

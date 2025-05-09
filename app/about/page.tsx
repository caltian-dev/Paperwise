import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
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
            <h1 className="text-3xl font-bold tracking-tight mb-8">About Us</h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-lg mb-6">
                At Paperwise, we believe legal protection shouldn't be complicated—or overpriced.
              </p>

              <p>
                Founded by a seasoned attorney with nearly 20 years of experience advising small businesses,
                entrepreneurs, and individuals, Paperwise was created to bridge a gap: making high-quality,
                attorney-reviewed legal documents accessible, affordable, and easy to use.
              </p>

              <p>
                Having worked directly with startups, consultants, freelancers, and growing teams, our founder saw
                firsthand how many business owners were forced to choose between DIY shortcuts or expensive custom legal
                work. Paperwise offers a smarter option—professionally drafted templates designed for real-world use,
                available on your terms, without the overhead.
              </p>

              <p>
                Whether you're launching your first business, building a side hustle, or simply need peace of mind for a
                deal or partnership, Paperwise is here to help you do it right—without breaking the bank.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

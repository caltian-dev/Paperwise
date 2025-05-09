import Link from "next/link"
import { Mail, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Contact Us | Paperwise",
  description: "Get in touch with the Paperwise team for any questions or custom legal solutions.",
}

export default function ContactPage() {
  return (
    <div className="container max-w-5xl py-12 md:py-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-teal-600 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-gray-500 max-w-2xl">
          Have questions about our legal templates or need a custom solution? We're here to help.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Send us an email and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-sm text-gray-500 mb-1">For general inquiries and support</p>
                  <a href="mailto:hellopaperwise@gmail.com" className="text-teal-600 hover:underline">
                    hellopaperwise@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Our Location</h3>
                  <p className="text-sm text-gray-500">We're a remote team serving clients across the United States</p>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <a href="mailto:hellopaperwise@gmail.com" className="flex items-center w-full justify-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us Now
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Legal Solutions</CardTitle>
            <CardDescription>Need something more tailored to your specific business needs?</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-6">
              Our team of experienced attorneys can create custom legal documents and provide personalized legal
              guidance for your business. Contact us to discuss your specific requirements and get a quote.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Services we offer:</h3>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Custom legal document drafting</li>
                  <li>• Legal document review and analysis</li>
                  <li>• Industry-specific compliance guidance</li>
                  <li>• Business formation assistance</li>
                  <li>• Contract negotiation support</li>
                </ul>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <a
                  href="mailto:hellopaperwise@gmail.com?subject=Custom%20Legal%20Solution%20Inquiry"
                  className="flex items-center w-full justify-center"
                >
                  Request Custom Solution
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold mb-2">Join Our Newsletter</h2>
        <p className="text-gray-500 mb-4 max-w-xl mx-auto">
          Subscribe to receive legal tips, template updates, and exclusive offers directly to your inbox.
        </p>
        <Button className="bg-teal-600 hover:bg-teal-700" asChild>
          <Link href="/#newsletter-section">Subscribe to Newsletter</Link>
        </Button>
      </div>
    </div>
  )
}

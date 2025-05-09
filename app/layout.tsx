import type React from "react"
import "@/app/globals.css"
import { Inter, Sora } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600"],
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
})

export const metadata = {
  title: "Paperwise | Smart Legal Templates for Small Business Owners",
  description:
    "Attorney-drafted legal templates built for small business owners, solo entrepreneurs, and freelancers. Fast, simple, and affordable legal documents without the subscription.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${sora.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <SiteHeader />
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

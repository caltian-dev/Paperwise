"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { FileText } from "lucide-react"

export function SiteHeader() {
  const session = useSession()
  const [mounted, setMounted] = useState(false)

  // Only show authentication-dependent UI after component has mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-7 w-7 text-teal-600" />
          <span className="text-2xl font-bold tracking-tight">Paperwise</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Features
            </Link>
            <Link href="/templates" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Templates
            </Link>
            <Link href="/bundles" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Bundles
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-teal-600 transition-colors">
              Blog
            </Link>
          </nav>

          {mounted && (
            <>
              {session.status === "authenticated" ? (
                <Button asChild variant="outline">
                  <Link href="/purchases">My Purchases</Link>
                </Button>
              ) : (
                <Button asChild className="bg-teal-600 hover:bg-teal-700">
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}

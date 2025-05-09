"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, BookOpen, Mail } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin-login")
    }
  }, [router])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/documents">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>Manage document templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Upload, edit, and organize your document templates.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/bundles">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Bundles
              </CardTitle>
              <CardDescription>Manage document bundles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Create and manage bundles of related documents.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blog">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Blog
              </CardTitle>
              <CardDescription>Manage blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Create, edit, and publish blog content.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/legal">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Legal Documents
              </CardTitle>
              <CardDescription>Manage legal pages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Upload and manage privacy policy, terms of service, and other legal documents.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/onboarding">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Email Onboarding
              </CardTitle>
              <CardDescription>Manage email sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Create and manage automated email onboarding sequences for new users.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle, Home, Settings } from "lucide-react"

export function BlogAdminNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="flex flex-col space-y-1">
      <Button
        variant={isActive("/admin/blog") && !isActive("/admin/blog/new") ? "secondary" : "ghost"}
        size="sm"
        className="justify-start"
        asChild
      >
        <Link href="/admin/blog">
          <FileText className="mr-2 h-4 w-4" />
          All Posts
        </Link>
      </Button>
      <Button variant={isActive("/admin/blog/new") ? "secondary" : "ghost"} size="sm" className="justify-start" asChild>
        <Link href="/admin/blog/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </Button>
      <Button variant="ghost" size="sm" className="justify-start" asChild>
        <Link href="/admin">
          <Settings className="mr-2 h-4 w-4" />
          Admin Dashboard
        </Link>
      </Button>
      <Button variant="ghost" size="sm" className="justify-start" asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
      </Button>
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/admin-login")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-teal-600">Paperwise Admin</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem("adminLoggedIn")
                router.push("/")
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <NavLink href="/admin" currentPath={pathname}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/documents" currentPath={pathname}>
              Documents
            </NavLink>
            <NavLink href="/admin/bundles" currentPath={pathname}>
              Bundles
            </NavLink>
            <NavLink href="/admin/blog" currentPath={pathname}>
              Blog
            </NavLink>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}

function NavLink({ href, children, currentPath }: { href: string; children: React.ReactNode; currentPath: string }) {
  const isActive = currentPath === href || (href !== "/admin" && currentPath.startsWith(href))

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-teal-100 text-teal-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {children}
    </Link>
  )
}

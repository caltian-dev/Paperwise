import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple admin credentials
const ADMIN_EMAIL = "admin@paperwise.com"
const ADMIN_PASSWORD = "password123"

// Simple token generation
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Check if user is authenticated
export async function isAuthenticated() {
  const cookieStore = cookies()
  const token = cookieStore.get("admin_token")
  return !!token?.value
}

// Check if user is admin
export async function isAdmin() {
  return isAuthenticated()
}

// Login function
export async function login(email: string, password: string) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { success: true, token: generateToken() }
  }
  return { success: false, error: "Invalid credentials" }
}

// Middleware function to check admin access
export async function checkAdminAccess() {
  const isAdminUser = await isAdmin()

  if (!isAdminUser) {
    redirect("/admin-login")
  }
}

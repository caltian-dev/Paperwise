import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"
import { compare } from "bcrypt"

// Create a SQL client
const sql = neon(process.env.DATABASE_URL!)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // For development/testing purposes, allow admin login with hardcoded credentials
          if (
            process.env.NODE_ENV === "development" &&
            credentials.email === "admin@paperwise.com" &&
            credentials.password === "password123"
          ) {
            return {
              id: "admin-dev",
              name: "Admin User",
              email: "admin@paperwise.com",
              role: "admin",
            }
          }

          // In production, check against the database
          const user = await sql`
            SELECT id, email, password, role, name
            FROM users
            WHERE email = ${credentials.email}
            LIMIT 1
          `.then((res) => res[0])

          if (!user) {
            return null
          }

          // Verify password
          const passwordMatch = await compare(credentials.password, user.password)
          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            name: user.name || user.email,
            email: user.email,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getSession() {
  return getServerSession(authOptions)
}

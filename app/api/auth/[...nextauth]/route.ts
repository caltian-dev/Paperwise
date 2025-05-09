import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Explicitly set runtime to nodejs
export const runtime = "nodejs"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

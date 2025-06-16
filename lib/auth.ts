import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { createUser, getUserByEmail } from "@/app/actions/database-actions"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // For demo purposes, we'll create a mock user validation
          // In production, you'd verify against a hashed password
          const user = await getUserByEmail(credentials.email)

          if (user.success && user.user) {
            return {
              id: user.user.id,
              email: user.user.email,
              name: user.user.name,
              role: user.user.role,
            }
          }

          // For demo purposes, allow any email/password combination
          // This should be removed in production
          if (credentials.email && credentials.password) {
            return {
              id: "demo-user-id",
              email: credentials.email,
              name: "Demo User",
              role: "student",
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" || account?.provider === "facebook") {
          if (!user.email) {
            return false
          }

          // Check if user exists
          const existingUser = await getUserByEmail(user.email)

          if (!existingUser.success) {
            // Create new user
            const createResult = await createUser({
              email: user.email,
              name: user.name || "Unknown User",
              role: "student",
              institution: "",
            })

            if (!createResult.success) {
              console.error("Failed to create user:", createResult.error)
              return false
            }
          }
        }

        return true
      } catch (error) {
        console.error("SignIn callback error:", error)
        return true // Allow sign in even if database operations fail
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "student"
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  debug: false, // Set to true only for debugging
}

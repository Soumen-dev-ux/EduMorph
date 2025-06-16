"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Brain } from "lucide-react"

interface AuthCheckProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthCheck({ children, requireAuth = false }: AuthCheckProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, requireAuth, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Loading...</h3>
          <p className="text-gray-600">Please wait while we set up your session</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

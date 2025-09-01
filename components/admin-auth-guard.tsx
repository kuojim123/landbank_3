"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0)
  const router = useRouter()
  const pathname = usePathname()

  const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
  const WARNING_TIME = 5 * 60 * 1000 // Show warning 5 minutes before timeout

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_login_time")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }, [router])

  const extendSession = useCallback(() => {
    const currentTime = Date.now()
    localStorage.setItem("admin_login_time", currentTime.toString())
    setShowSessionWarning(false)
  }, [])

  const checkSessionTimeout = useCallback(() => {
    const loginTime = localStorage.getItem("admin_login_time")
    if (!loginTime) return false

    const currentTime = Date.now()
    const elapsedTime = currentTime - Number.parseInt(loginTime)
    const timeLeft = SESSION_TIMEOUT - elapsedTime

    if (timeLeft <= 0) {
      // Session expired
      logout()
      return false
    }

    if (timeLeft <= WARNING_TIME && !showSessionWarning) {
      // Show warning
      setSessionTimeLeft(Math.ceil(timeLeft / 1000 / 60)) // Convert to minutes
      setShowSessionWarning(true)
    }

    return true
  }, [logout, showSessionWarning])

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Auth guard checking authentication for path:", pathname)

      // Skip auth check for login page
      if (pathname === "/admin/login") {
        console.log("[v0] On login page, allowing access")
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      console.log("[v0] localStorage available:", typeof Storage !== "undefined")
      console.log("[v0] localStorage keys:", Object.keys(localStorage))
      console.log("[v0] sessionStorage keys:", Object.keys(sessionStorage))

      // Check localStorage first
      let token = localStorage.getItem("admin_token")
      console.log("[v0] Token found in localStorage:", !!token)

      // If not in localStorage, check sessionStorage
      if (!token) {
        token = sessionStorage.getItem("admin_token")
        console.log("[v0] Token found in sessionStorage:", !!token)

        // If found in sessionStorage, restore to localStorage
        if (token) {
          const loginTime = sessionStorage.getItem("admin_login_time")
          localStorage.setItem("admin_token", token)
          if (loginTime) localStorage.setItem("admin_login_time", loginTime)
          console.log("[v0] Restored token from sessionStorage to localStorage")
        }
      }

      // If still no token, check cookies as last resort
      if (!token) {
        const cookies = document.cookie.split(";")
        const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("admin_token="))
        if (tokenCookie) {
          token = tokenCookie.split("=")[1]
          console.log("[v0] Token found in cookie:", !!token)

          // Restore to localStorage
          if (token) {
            localStorage.setItem("admin_token", token)
            localStorage.setItem("admin_login_time", Date.now().toString())
            console.log("[v0] Restored token from cookie to localStorage")
          }
        }
      }

      console.log("[v0] Final token status:", !!token)
      console.log("[v0] Actual token value:", token ? token.substring(0, 20) + "..." : "null")

      if (token) {
        // Verify token is still valid and check session timeout
        const isSessionValid = checkSessionTimeout()

        if (isSessionValid) {
          console.log("[v0] Token exists and session valid, setting authenticated to true")
          setIsAuthenticated(true)

          // Set login time if not exists (for backward compatibility)
          if (!localStorage.getItem("admin_login_time")) {
            localStorage.setItem("admin_login_time", Date.now().toString())
          }
        }
      } else {
        console.log("[v0] No token found in any storage method, redirecting to login")
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router, checkSessionTimeout])

  useEffect(() => {
    if (!isAuthenticated || pathname === "/admin/login") return

    const interval = setInterval(() => {
      checkSessionTimeout()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isAuthenticated, pathname, checkSessionTimeout])

  useEffect(() => {
    if (!isAuthenticated || pathname === "/admin/login") return

    const handleActivity = () => {
      // Update last activity time on user interaction
      const loginTime = localStorage.getItem("admin_login_time")
      if (loginTime) {
        const currentTime = Date.now()
        const elapsedTime = currentTime - Number.parseInt(loginTime)

        // Only update if more than 5 minutes have passed since last update
        if (elapsedTime > 5 * 60 * 1000) {
          localStorage.setItem("admin_login_time", currentTime.toString())
        }
      }
    }

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">載入中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  return (
    <>
      {children}

      <AlertDialog open={showSessionWarning} onOpenChange={setShowSessionWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>會話即將過期</AlertDialogTitle>
            <AlertDialogDescription>
              您的登入會話將在 {sessionTimeLeft} 分鐘後過期。
              <br />
              請選擇延長會話或重新登入。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-700">
              登出
            </AlertDialogAction>
            <AlertDialogAction onClick={extendSession} className="bg-green-600 hover:bg-green-700">
              延長會話
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

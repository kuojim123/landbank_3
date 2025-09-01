"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const testStorage = (storage: Storage, key: string, value: string): boolean => {
    try {
      storage.setItem(key, value)
      const retrieved = storage.getItem(key)
      if (retrieved === value) {
        storage.removeItem(key)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const storeToken = (token: string): boolean => {
    const timestamp = Date.now().toString()

    console.log("[v0] Testing storage mechanisms...")

    // Test localStorage first
    const localStorageWorks = testStorage(localStorage, "test_key", "test_value")
    console.log("[v0] localStorage test result:", localStorageWorks)

    if (localStorageWorks) {
      try {
        localStorage.setItem("admin_token", token)
        localStorage.setItem("admin_login_time", timestamp)
        console.log("[v0] Token stored in localStorage successfully")
        return true
      } catch (error) {
        console.log("[v0] localStorage failed despite test:", error)
      }
    }

    // Fallback to sessionStorage
    const sessionStorageWorks = testStorage(sessionStorage, "test_key", "test_value")
    console.log("[v0] sessionStorage test result:", sessionStorageWorks)

    if (sessionStorageWorks) {
      try {
        sessionStorage.setItem("admin_token", token)
        sessionStorage.setItem("admin_login_time", timestamp)
        console.log("[v0] Token stored in sessionStorage as fallback")
        return true
      } catch (error) {
        console.log("[v0] sessionStorage failed despite test:", error)
      }
    }

    // Final fallback to cookies
    try {
      document.cookie = `admin_token=${token}; path=/admin; max-age=1800; SameSite=Strict`
      document.cookie = `admin_login_time=${timestamp}; path=/admin; max-age=1800; SameSite=Strict`
      console.log("[v0] Token stored in cookies as final fallback")
      return true
    } catch (error) {
      console.log("[v0] Cookie storage also failed:", error)
      return false
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("[v0] Attempting login with credentials:", { username: credentials.username })

      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()
      console.log("[v0] Login API response:", { success: response.ok, data })

      if (response.ok) {
        const storageSuccess = storeToken(data.token)

        if (!storageSuccess) {
          console.error("[v0] CRITICAL: All storage mechanisms failed!")
          setError("無法存儲認證信息。請檢查瀏覽器設置或嘗試非隱私模式。")
          return
        }

        console.log("[v0] Token storage successful, redirecting to dashboard")
        // Use replace instead of push to avoid back button issues
        router.replace("/admin/dashboard")
      } else {
        console.log("[v0] Login failed:", data.error)
        setError(data.error || "登入失敗")
      }
    } catch (error) {
      console.log("[v0] Login error:", error)
      setError("網路連接錯誤，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">管理員登入</CardTitle>
          <CardDescription>阿福e助理管理後台</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">帳號</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="請輸入管理員帳號"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="請輸入密碼"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登入中..." : "登入"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>測試帳號：</strong>
              <br />
              帳號：admin
              <br />
              密碼：admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

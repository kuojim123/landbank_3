"use client"

import type React from "react"
import AdminAuthGuard from "@/components/admin-auth-guard"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, MessageSquare, Settings, Menu, X, Home, Database, LogOut, WifiOff, Shield } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const navigation = [
  { name: "儀表板", href: "/admin/dashboard", icon: Home },
  { name: "知識庫管理", href: "/admin/knowledge", icon: Database },
  { name: "回饋分析", href: "/admin/analytics", icon: BarChart3 },
  { name: "回饋管理", href: "/admin/feedback", icon: MessageSquare },
  { name: "系統設定", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "網路連線已恢復",
        description: "您現在可以正常使用系統功能",
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "網路連線中斷",
        description: "請檢查您的網路連線",
        variant: "destructive",
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_login_time")
        toast({
          title: "登出成功",
          description: "您已安全登出系統",
        })
        router.push("/admin/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if API fails
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_login_time")
      toast({
        title: "登出完成",
        description: "已清除本地認證資訊",
        variant: "destructive",
      })
      router.push("/admin/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background">
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm">
            <div className="flex items-center justify-center gap-2">
              <WifiOff className="h-4 w-4" />
              網路連線中斷 - 部分功能可能無法使用
            </div>
          </div>
        )}

        {/* Mobile sidebar */}
        <div className={cn("fixed inset-0 z-40 lg:hidden", sidebarOpen ? "block" : "hidden")}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h2 className="text-lg font-semibold text-primary">後台管理</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      !isOnline && "opacity-50 pointer-events-none",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "登出中..." : "登出"}
              </Button>
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-card lg:border-r lg:border-border lg:block lg:shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold text-primary">後台管理</h2>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    !isOnline && "opacity-50 pointer-events-none",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted mt-4"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "登出中..." : "登出"}
            </Button>
          </nav>
        </div>

        {/* Main content */}
        <div className={cn("lg:pl-64", !isOnline && "pt-12")}>
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h1 className="text-lg font-semibold text-primary">後台管理</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {children}
        </div>
      </div>
    </AdminAuthGuard>
  )
}

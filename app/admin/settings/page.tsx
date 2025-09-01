"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Save, Shield, Bell, Database, Palette, MessageCircle, Users } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // System Settings
    systemName: "阿福e助理",
    systemDescription: "企業網路銀行AI助理系統",
    maintenanceMode: false,

    // AI Message Settings
    welcomeMessage: "您好！我是阿福e助理，有什麼企業網銀問題可以協助您？",
    noAnswerMessage: "很抱歉，我目前無法回答這個問題。請您聯繫客服專線 (02) 2348-3456，或嘗試重新描述您的問題。",
    enableWelcomeMessage: true,

    // AI Settings
    aiResponseDelay: 1000,
    maxRecommendations: 3,
    enableSmartRecommendations: true,

    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableTwoFactor: false,

    // Notification Settings
    emailNotifications: true,
    feedbackAlerts: true,
    systemAlerts: true,

    // UI Settings
    primaryColor: "#34C759",
    chatWindowWidth: 360,
    chatWindowHeight: 540,

    // Admin Account Settings (Future)
    enableAccountManagement: false,
    defaultAdminRole: "admin",
  })

  const handleSave = () => {
    try {
      // Validate required fields
      if (!settings.welcomeMessage.trim()) {
        alert("歡迎訊息不能為空")
        return
      }
      if (!settings.noAnswerMessage.trim()) {
        alert("無法回答時的訊息不能為空")
        return
      }

      // Save settings logic here
      console.log("Saving settings:", settings)

      // Simulate API call
      setTimeout(() => {
        alert("設定已成功儲存！")
      }, 500)
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("儲存設定時發生錯誤，請稍後再試")
    }
  }

  const handleReset = () => {
    if (confirm("確定要重設所有設定嗎？此操作將恢復預設值且無法復原。")) {
      setSettings({
        systemName: "阿福e助理",
        systemDescription: "企業網路銀行AI助理系統",
        maintenanceMode: false,
        welcomeMessage: "您好！我是阿福e助理，有什麼企業網銀問題可以協助您？",
        noAnswerMessage: "很抱歉，我目前無法回答這個問題。請您聯繫客服專線 (02) 2348-3456，或嘗試重新描述您的問題。",
        enableWelcomeMessage: true,
        aiResponseDelay: 1000,
        maxRecommendations: 3,
        enableSmartRecommendations: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        enableTwoFactor: false,
        emailNotifications: true,
        feedbackAlerts: true,
        systemAlerts: true,
        primaryColor: "#34C759",
        chatWindowWidth: 360,
        chatWindowHeight: 540,
        enableAccountManagement: false,
        defaultAdminRole: "admin",
      })
      alert("設定已重設為預設值")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
          <p className="text-gray-600">管理系統配置和偏好設定</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            重設
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            儲存設定
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              系統設定
            </CardTitle>
            <CardDescription>基本系統配置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systemName">系統名稱</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="systemDescription">系統描述</Label>
                <Input
                  id="systemDescription"
                  value={settings.systemDescription}
                  onChange={(e) => setSettings({ ...settings, systemDescription: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
              <Label htmlFor="maintenanceMode">維護模式</Label>
            </div>
          </CardContent>
        </Card>

        {/* AI Message Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI 助理訊息設定
            </CardTitle>
            <CardDescription>自訂AI助理的預設訊息內容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="enableWelcomeMessage"
                checked={settings.enableWelcomeMessage}
                onCheckedChange={(checked) => setSettings({ ...settings, enableWelcomeMessage: checked })}
              />
              <Label htmlFor="enableWelcomeMessage">啟用歡迎訊息</Label>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="welcomeMessage">預設歡迎訊息</Label>
                <Textarea
                  id="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  placeholder="輸入用戶開啟聊天視窗時顯示的歡迎訊息"
                  rows={3}
                  disabled={!settings.enableWelcomeMessage}
                />
                <p className="text-xs text-gray-500 mt-1">此訊息會在用戶首次開啟聊天視窗時顯示</p>
              </div>

              <div>
                <Label htmlFor="noAnswerMessage">無法回答時的預設回覆</Label>
                <Textarea
                  id="noAnswerMessage"
                  value={settings.noAnswerMessage}
                  onChange={(e) => setSettings({ ...settings, noAnswerMessage: e.target.value })}
                  placeholder="輸入當AI助理無法回答問題時的預設回覆內容"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">當AI助理在知識庫中找不到相關答案時會顯示此訊息</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle>AI 助理行為設定</CardTitle>
            <CardDescription>調整AI助理的行為和回應</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aiResponseDelay">回應延遲 (毫秒)</Label>
                <Input
                  id="aiResponseDelay"
                  type="number"
                  min="0"
                  max="5000"
                  value={settings.aiResponseDelay}
                  onChange={(e) => setSettings({ ...settings, aiResponseDelay: Number.parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">模擬真人回應的延遲時間</p>
              </div>
              <div>
                <Label htmlFor="maxRecommendations">最大推薦數量</Label>
                <Input
                  id="maxRecommendations"
                  type="number"
                  min="1"
                  max="5"
                  value={settings.maxRecommendations}
                  onChange={(e) => setSettings({ ...settings, maxRecommendations: Number.parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">每次顯示的推薦問題數量</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableSmartRecommendations"
                checked={settings.enableSmartRecommendations}
                onCheckedChange={(checked) => setSettings({ ...settings, enableSmartRecommendations: checked })}
              />
              <Label htmlFor="enableSmartRecommendations">啟用智能推薦</Label>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              安全設定
            </CardTitle>
            <CardDescription>系統安全和認證設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout">會話逾時 (分鐘)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxLoginAttempts">最大登入嘗試次數</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableTwoFactor"
                checked={settings.enableTwoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
              />
              <Label htmlFor="enableTwoFactor">啟用雙因子認證 (未來功能)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Admin Account Management (Future Feature) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              管理員帳號管理
            </CardTitle>
            <CardDescription>管理員帳號和權限設定 (未來功能)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="enableAccountManagement"
                checked={settings.enableAccountManagement}
                onCheckedChange={(checked) => setSettings({ ...settings, enableAccountManagement: checked })}
                disabled
              />
              <Label htmlFor="enableAccountManagement" className="text-gray-400">
                啟用帳號管理功能 (開發中)
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
              <div>
                <Label htmlFor="defaultAdminRole">預設管理員角色</Label>
                <Input id="defaultAdminRole" value={settings.defaultAdminRole} disabled placeholder="admin" />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>未來功能預告：</strong>此功能將支援多管理員帳號管理、角色權限控制、操作日誌記錄等進階功能。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知設定
            </CardTitle>
            <CardDescription>管理系統通知和警報</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
                <Label htmlFor="emailNotifications">電子郵件通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="feedbackAlerts"
                  checked={settings.feedbackAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, feedbackAlerts: checked })}
                />
                <Label htmlFor="feedbackAlerts">回饋警報</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="systemAlerts"
                  checked={settings.systemAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
                />
                <Label htmlFor="systemAlerts">系統警報</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UI Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              介面設定
            </CardTitle>
            <CardDescription>自訂使用者介面外觀</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">主要顏色</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="chatWindowWidth">聊天視窗寬度 (px)</Label>
                <Input
                  id="chatWindowWidth"
                  type="number"
                  min="300"
                  max="500"
                  value={settings.chatWindowWidth}
                  onChange={(e) => setSettings({ ...settings, chatWindowWidth: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="chatWindowHeight">聊天視窗高度 (px)</Label>
                <Input
                  id="chatWindowHeight"
                  type="number"
                  min="400"
                  max="700"
                  value={settings.chatWindowHeight}
                  onChange={(e) => setSettings({ ...settings, chatWindowHeight: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

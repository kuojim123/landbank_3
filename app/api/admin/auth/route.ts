import { type NextRequest, NextResponse } from "next/server"

// Simple demo authentication - in production, use proper password hashing
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // In production, this should be hashed
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate a simple token (in production, use JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64")

      const response = NextResponse.json({
        success: true,
        token,
        message: "登入成功",
      })

      // Set HTTP-only cookie for security
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      })

      return response
    } else {
      return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 })
  }
}

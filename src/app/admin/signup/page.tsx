"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminSignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [adminSecretKey, setAdminSecretKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/admin/dashboard")
      } else {
        setCheckingSession(false)
      }
    }).catch(() => {
      setCheckingSession(false);
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, adminSecretKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
        setLoading(false)
        return
      }

      router.push("/admin/dashboard")
    } catch {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] p-4">
      <Card className="w-full max-w-sm border-border bg-[#1A1A1A]">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gold">
            <span className="text-lg font-bold text-black">RF</span>
          </div>
          <CardTitle className="text-xl text-white">Admin Sign Up</CardTitle>
          <CardDescription className="text-gray-400">
            Create an admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                placeholder="admin@rialtofurniture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Admin Secret Key</label>
              <Input
                type="password"
                placeholder="Enter the admin secret key"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                required
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black hover:bg-gold/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/admin/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

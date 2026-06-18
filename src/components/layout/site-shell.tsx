"use client"

import { usePathname } from "next/navigation"
import { CartProvider } from "@/providers/cart-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { Toaster } from "sonner"

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) {
    return (
      <CartProvider>
        {children}
        <Toaster position="top-right" richColors />
      </CartProvider>
    )
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Toaster position="top-right" richColors />
    </CartProvider>
  )
}

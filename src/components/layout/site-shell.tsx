"use client"

import { usePathname } from "next/navigation"
import { CartProvider } from "@/providers/cart-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { BackToTop } from "@/components/layout/back-to-top"
import { SmoothScroll } from "@/components/layout/smooth-scroll"
import { PageTransition } from "@/components/layout/page-transition"
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
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        <main className="flex-1">
          <PageTransition key={pathname}>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        <Toaster position="top-right" richColors />
      </SmoothScroll>
    </CartProvider>
  )
}

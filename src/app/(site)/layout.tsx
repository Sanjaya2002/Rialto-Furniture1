import { CartProvider } from "@/providers/cart-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Navbar } from "@/components/site/layout/navbar";
import { Footer } from "@/components/site/layout/footer";
import { CartDrawer } from "@/components/site/cart/cart-drawer";
import { WhatsAppFab } from "@/components/site/layout/whatsapp-fab";
import { listCategories } from "@/server/services/categories";
import { safely } from "@/server/safely";

export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await safely(listCategories, [], "footer categories");

  return (
    <CartProvider>
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer categories={categories.map(({ name, slug }) => ({ name, slug }))} />
        <CartDrawer />
        <WhatsAppFab />
      </SmoothScroll>
    </CartProvider>
  );
}

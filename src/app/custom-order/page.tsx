import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import CustomOrderForm from "./custom-order-form";

export const metadata: Metadata = {
  title: "Custom Orders",
  description: `Request bespoke furniture tailored to your needs with ${SITE_CONFIG.name}. Custom sizes, materials, and designs.`,
  openGraph: {
    title: `Custom Orders | ${SITE_CONFIG.name}`,
    description: `Request bespoke furniture tailored to your needs with ${SITE_CONFIG.name}. Custom sizes, materials, and designs.`,
  },
};

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen pt-28">
      <section className="bg-luxury-gray py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-black">
            Custom Furniture <span className="text-gold">Orders</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Bring your vision to life. We craft bespoke furniture tailored to your exact specifications.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold text-luxury-black">How It Works</h2>
              <div className="w-16 h-1 bg-gold mt-4 mb-6" />
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Tell Us Your Idea</h3>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form with your requirements, dimensions, and any reference images.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Get a Quote</h3>
                    <p className="text-sm text-muted-foreground">
                      Our team reviews your request and provides a detailed quote within 48 hours.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">We Craft It</h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, our skilled craftsmen bring your vision to life with premium materials.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Delivery & Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      We deliver and set up your custom piece at your location across Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <CustomOrderForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

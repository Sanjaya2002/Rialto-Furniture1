import type { Metadata } from "next";
import { SITE_CONFIG, WHY_CHOOSE_US } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_CONFIG.name}'s story, mission, and commitment to premium furniture craftsmanship in Sri Lanka.`,
  openGraph: {
    title: `About Us | ${SITE_CONFIG.name}`,
    description: `Learn about ${SITE_CONFIG.name}'s story, mission, and commitment to premium furniture craftsmanship in Sri Lanka.`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28">
      <section className="bg-luxury-gray py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-black">
            About <span className="text-gold">Rialto Furniture</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Crafting premium furniture solutions for Sri Lanka with timeless elegance and uncompromising quality.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">Our Story</h2>
              <div className="w-16 h-1 bg-gold mt-4 mb-6" />
              <p className="text-muted-foreground leading-relaxed mb-4">
                Rialto Furniture was born from a vision to transform spaces across Sri Lanka with furniture that
                marries timeless design with uncompromising quality. What began as a small workshop has grown into
                a trusted name for premium office, commercial, and educational furniture.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is simple: to provide furniture that not only looks exceptional but stands the test
                of time. Every piece we craft reflects our dedication to superior materials, expert craftsmanship,
                and customer satisfaction.
              </p>
            </div>
            <div className="bg-luxury-gray rounded-lg h-80 flex items-center justify-center">
              <span className="text-muted-foreground">[Company Image]</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-luxury-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">Our Mission</h3>
              <div className="w-12 h-1 bg-gold mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                To provide premium, high-quality furniture solutions that enhance the comfort, productivity,
                and aesthetic appeal of every space we touch, while delivering exceptional value and service
                to our customers across Sri Lanka.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4">Our Vision</h3>
              <div className="w-12 h-1 bg-gold mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                To be Sri Lanka's most trusted furniture brand, recognized for our unwavering commitment to
                quality, innovation in design, and the highest standards of customer service — furnishing
                every space with elegance and purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">
              Why Choose Rialto Furniture
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold text-xl font-bold">{item.icon[0]}</span>
                </div>
                <h3 className="font-serif font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-luxury-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">Our Values</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4 mb-8" />
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg">
            We believe in integrity, craftsmanship, and putting our customers first. Every piece of furniture
            we deliver is backed by a promise of quality and a commitment to excellence that defines who we are.
          </p>
        </div>
      </section>
    </div>
  );
}

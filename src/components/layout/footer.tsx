import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Music2 } from "lucide-react";
import { SITE_CONFIG, SOCIAL_LINKS, FOOTER_LINKS } from "@/lib/constants";
import { staggerContainer, staggerItemFast, fadeUp } from "@/lib/animations";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const MotionLink = motion.create(Link);

export function Footer() {
  return (
    <motion.footer
      className="bg-luxury-black text-white/80"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <motion.div variants={staggerItemFast}>
            <h3 className="text-2xl font-serif font-bold gold-text mb-4">Rialto Furniture</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {SITE_CONFIG.tagline}. Premium furniture for offices, businesses, and commercial spaces across Sri Lanka.
            </p>
            <div className="flex gap-3">
              {[
                { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: FacebookIcon },
                { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: InstagramIcon },
                { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", icon: LinkedInIcon },
                { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: Music2 },
              ].map(({ href, label, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
                  aria-label={label}
                  whileHover={{ scale: 1.15, borderColor: "#D4AF37", color: "#D4AF37" }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={staggerItemFast}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <MotionLink
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors inline-block"
                    whileHover={{ x: 4, color: "#D4AF37" }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItemFast}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.categories.map((link) => (
                <li key={link.href}>
                  <MotionLink
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors inline-block"
                    whileHover={{ x: 4, color: "#D4AF37" }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </MotionLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItemFast}>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <motion.a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                  whileHover={{ color: "#D4AF37" }}
                >
                  {SITE_CONFIG.phone}
                </motion.a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <motion.a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                  whileHover={{ color: "#D4AF37" }}
                >
                  {SITE_CONFIG.email}
                </motion.a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}

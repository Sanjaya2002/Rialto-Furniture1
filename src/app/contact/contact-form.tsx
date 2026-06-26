"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fadeUp, staggerContainer, staggerItemFast } from "@/lib/animations";
import { CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll get back to you soon.");
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        </motion.div>
        <h3 className="text-2xl font-serif font-bold text-luxury-black mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6">
          Your message has been sent successfully. We&apos;ll get back to you soon.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        variants={staggerItemFast}
        className="text-2xl font-serif font-bold text-luxury-black"
      >
        Send us a Message
      </motion.h3>

      <motion.div variants={staggerItemFast} className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </motion.div>

      <motion.div variants={staggerItemFast} className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </motion.div>

      <motion.div variants={staggerItemFast} className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+94 77 123 4567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </motion.div>

      <motion.div variants={staggerItemFast} className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </motion.div>

      <motion.div variants={staggerItemFast}>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gold hover:bg-gold-dark text-white"
        >
          {loading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Sending...
            </motion.span>
          ) : (
            "Send Message"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}

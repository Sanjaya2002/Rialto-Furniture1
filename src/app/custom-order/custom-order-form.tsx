"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FURNITURE_TYPES = ["Chair", "Desk", "Table", "Cabinet", "Sofa", "Bed", "Other"];

export default function CustomOrderForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    furnitureType: "",
    description: "",
    dimensions: "",
    file: null as File | null,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const body = new FormData();
      body.append("customerName", formData.customerName);
      body.append("email", formData.email);
      body.append("phone", formData.phone);
      body.append("furnitureType", formData.furnitureType);
      body.append("description", formData.description);
      body.append("dimensions", formData.dimensions);
      if (formData.file) body.append("file", formData.file);

      const res = await fetch("/api/custom-orders", {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error("Failed to submit order");

      toast.success("Custom order submitted successfully! We'll review it and get back to you.");
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        furnitureType: "",
        description: "",
        dimensions: "",
        file: null,
      });
    } catch {
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-xl border border-gray-100 p-8 shadow-sm"
    >
      <h3 className="text-2xl font-serif font-bold text-luxury-black">Request a Custom Order</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Full Name *</Label>
          <Input
            id="customerName"
            placeholder="Your full name"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+94 77 123 4567"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="furnitureType">Furniture Type *</Label>
          <select
            id="furnitureType"
            required
            value={formData.furnitureType}
            onChange={(e) => setFormData({ ...formData, furnitureType: e.target.value })}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Select a type</option>
            {FURNITURE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe your ideal piece — style, material, color, and any special requirements"
          rows={4}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            placeholder="e.g. 120cm x 60cm x 75cm"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">Reference Image / Sketch</Label>
          <Input
            id="file"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files?.[0] || null })
            }
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-dark text-white"
      >
        {loading ? "Submitting..." : "Submit Custom Order"}
      </Button>
    </form>
  );
}

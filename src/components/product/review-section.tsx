"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { staggerContainer, staggerItemFast } from "@/lib/animations";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) =>
        setReviews(Array.isArray(data) ? data : data.reviews || [])
      )
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const newReview = await res.json();
      setReviews((prev) => [
        { ...newReview, id: newReview.id || crypto.randomUUID() },
        ...prev,
      ]);
      setName("");
      setRating(5);
      setComment("");
      toast.success("Review submitted successfully");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="mt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.h2
        variants={staggerItemFast}
        className="text-2xl font-serif font-bold text-luxury-black mb-6"
      >
        Customer Reviews
      </motion.h2>

      <motion.form
        variants={staggerItemFast}
        onSubmit={handleSubmit}
        className="mb-8 p-6 border rounded-lg bg-gray-50 space-y-4"
      >
        <h3 className="font-semibold text-lg">Write a Review</h3>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label>Rating</Label>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= rating
                      ? "fill-gold text-gold"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-gold text-luxury-black hover:bg-gold-dark font-semibold"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </motion.form>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={staggerItemFast}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-luxury-black">
                    {review.name}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? "fill-gold text-gold"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.p
          variants={staggerItemFast}
          className="text-muted-foreground text-center py-8"
        >
          No reviews yet. Be the first to review this product!
        </motion.p>
      )}
    </motion.div>
  );
}

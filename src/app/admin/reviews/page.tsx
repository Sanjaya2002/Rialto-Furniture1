"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"
import { Star, Trash2 } from "lucide-react"

interface Review {
  id: string
  productId: string
  name: string
  rating: number
  comment: string
  createdAt: string
  product: { name: string }
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingReview, setDeletingReview] = useState<Review | null>(null)

  const fetchReviews = useCallback(async () => {
    const res = await adminFetch("/api/reviews")
    const data = await res.json()
    setReviews(data)
  }, [])

  useEffect(() => {
    fetchReviews().finally(() => setLoading(false))
  }, [fetchReviews])

  async function handleDelete() {
    if (!deletingReview) return
    try {
      const res = await adminFetch(`/api/reviews/${deletingReview.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete review")
      toast.success("Review deleted")
      setDeleteOpen(false)
      setDeletingReview(null)
      fetchReviews()
    } catch {
      toast.error("Failed to delete review")
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < rating ? "fill-gold text-gold" : "fill-none text-gray-600"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Reviews</h1>
        <p className="mt-1 text-sm text-gray-400">Manage customer product reviews</p>
      </div>

      <div className="rounded-lg border border-border bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Comment</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-12 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : reviews.map((review) => (
                  <TableRow key={review.id} className="border-border text-white">
                    <TableCell className="font-medium text-gray-300">
                      {review.product?.name}
                    </TableCell>
                    <TableCell>{review.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-400">
                      {review.comment}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(new Date(review.createdAt))}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingReview(review)
                          setDeleteOpen(true)
                        }}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this review by &ldquo;{deletingReview?.name}&rdquo;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-border text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

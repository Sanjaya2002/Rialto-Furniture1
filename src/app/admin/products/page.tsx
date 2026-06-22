"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/utils"
import { adminFetch } from "@/lib/admin-fetch"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  categoryId: string
  category: Category
  images: string[]
  stock: number
  featured: boolean
  specifications: Record<string, unknown> | null
}

interface ProductForm {
  name: string
  description: string
  price: string
  categoryId: string
  images: string
  stock: string
  featured: boolean
  specifications: string
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  images: "",
  stock: "0",
  featured: false,
  specifications: "",
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<ProductForm>(emptyForm)

  const fetchProducts = useCallback(async () => {
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data.products ?? [])
  }, [])

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetch("/api/categories")
        .then((res) => res.json())
        .then(setCategories),
    ]).finally(() => setLoading(false))
  }, [fetchProducts])



  function openAddDialog() {
    setEditingProduct(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId,
      images: product.images.join(", "),
      stock: String(product.stock),
      featured: product.featured,
      specifications: product.specifications
        ? JSON.stringify(product.specifications, null, 2)
        : "",
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
        specifications: form.specifications ? JSON.parse(form.specifications) : null,
      }

      if (editingProduct) {
        const res = await adminFetch(`/api/products/${editingProduct.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to update product")
        toast.success("Product updated")
      } else {
        const res = await adminFetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to create product")
        toast.success("Product created")
      }

      setDialogOpen(false)
      fetchProducts()
    } catch {
      toast.error("Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return
    try {
      const res = await adminFetch(`/api/products/${deletingProduct.slug}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete product")
      toast.success("Product deleted")
      setDeleteOpen(false)
      setDeletingProduct(null)
      fetchProducts()
    } catch {
      toast.error("Failed to delete product")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your product catalog</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gold text-black hover:bg-gold/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Image</TableHead>
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Price</TableHead>
              <TableHead className="text-gray-400">Stock</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-10 w-10 rounded bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : products.map((product) => (
                  <TableRow key={product.id} className="border-border text-white">
                    <TableCell>
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-white/5 text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-400">{product.category?.name}</TableCell>
                    <TableCell className="text-gold">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.stock > 0
                            ? "border-green-500/30 text-green-400"
                            : "border-red-500/30 text-red-400"
                        }
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingProduct(product)
                            setDeleteOpen(true)
                          }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingProduct ? "Update product details" : "Fill in the details to create a new product"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-gray-300">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-border bg-[#0B0B0B] text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-border bg-[#0B0B0B] text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-gray-300">Price (LKR)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="border-border bg-[#0B0B0B] text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-300">Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="border-border bg-[#0B0B0B] text-white"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-300">Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm({ ...form, categoryId: v })}
              >
                <SelectTrigger className="border-border bg-[#0B0B0B] text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-border bg-[#1A1A1A] text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-300">Images (comma-separated URLs)</Label>
              <Input
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-border bg-[#0B0B0B] text-gold accent-gold"
              />
              <Label htmlFor="featured" className="text-gray-300">
                Featured product
              </Label>
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-300">Specifications (JSON)</Label>
              <Textarea
                value={form.specifications}
                onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                className="border-border bg-[#0B0B0B] font-mono text-xs text-white"
                rows={5}
                placeholder='{"material": "Wood", "weight": "10kg"}'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gold text-black hover:bg-gold/90"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Delete</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete &ldquo;{deletingProduct?.name}&rdquo;? This action cannot be undone.
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

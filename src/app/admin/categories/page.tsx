"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { toast } from "sonner"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  _count: { products: number }
}

interface CategoryForm {
  name: string
  description: string
  image: string
}

const emptyForm: CategoryForm = { name: "", description: "", image: "" }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CategoryForm>(emptyForm)

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories")
    const data = await res.json()
    setCategories(data)
  }, [])

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false))
  }, [fetchCategories])

  function openAddDialog() {
    setEditingCategory(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category)
    setForm({
      name: category.name,
      description: category.description ?? "",
      image: category.image ?? "",
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = {
        name: form.name,
        description: form.description || undefined,
        image: form.image || undefined,
      }

      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to update category")
        toast.success("Category updated")
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to create category")
        toast.success("Category created")
      }

      setDialogOpen(false)
      fetchCategories()
    } catch {
      toast.error("Failed to save category")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return
    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete category")
      toast.success("Category deleted")
      setDeleteOpen(false)
      setDeletingCategory(null)
      fetchCategories()
    } catch {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Categories</h1>
          <p className="mt-1 text-sm text-gray-400">Organize your product categories</p>
        </div>
        <Button onClick={openAddDialog} className="bg-gold text-black hover:bg-gold/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-[#1A1A1A]">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Slug</TableHead>
              <TableHead className="text-gray-400">Products</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-white/5" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 bg-white/5" /></TableCell>
                  </TableRow>
                ))
              : categories.map((category) => (
                  <TableRow key={category.id} className="border-border text-white">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-gray-400">{category.slug}</TableCell>
                    <TableCell className="text-gray-400">{category._count?.products ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingCategory(category)
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
        <DialogContent className="border-border bg-[#1A1A1A]">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingCategory ? "Update category details" : "Fill in the details to create a new category"}
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
            <div className="grid gap-2">
              <Label className="text-gray-300">Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="border-border bg-[#0B0B0B] text-white placeholder:text-gray-600"
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
              Are you sure you want to delete &ldquo;{deletingCategory?.name}&rdquo;? Products in this
              category will become uncategorized.
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

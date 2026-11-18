"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/image-uploader";
import { apiRequest, errorMessage, jsonBody } from "@/lib/api-client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

interface CategoryForm {
  name: string;
  description: string;
  image: string;
}

const emptyForm: CategoryForm = { name: "", description: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not load data");
      return;
    }
    setCategories(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false));
  }, [fetchCategories]);

  function openAddDialog() {
    setEditingCategory(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(category: Category) {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
      image: category.image ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        image: form.image || null,
      };

      if (editingCategory) {
        await apiRequest(`/api/categories/${editingCategory.id}`, jsonBody(body, "PUT"));
        toast.success("Category updated");
      } else {
        await apiRequest("/api/categories", jsonBody(body));
        toast.success("Category created");
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to save category"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return;
    try {
      await apiRequest(`/api/categories/${deletingCategory.id}`, { method: "DELETE" });
      toast.success("Category deleted");
      setDeleteOpen(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(errorMessage(error, "Failed to delete category"));
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl">Categories</h1>
          <p className="mt-1 text-sm text-ink-muted">Organize your product categories</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-ink-muted">Name</TableHead>
              <TableHead className="text-ink-muted">Slug</TableHead>
              <TableHead className="text-ink-muted">Products</TableHead>
              <TableHead className="text-ink-muted">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell>
                      <Skeleton className="h-4 w-32 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12 bg-bone" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20 bg-bone" />
                    </TableCell>
                  </TableRow>
                ))
              : categories.map((category) => (
                  <TableRow key={category.id} className="border-border text-ink">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-ink-muted">{category.slug}</TableCell>
                    <TableCell className="text-ink-muted">{category._count?.products ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          className="text-ink-muted hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingCategory(category);
                            setDeleteOpen(true);
                          }}
                          className="text-ink-muted hover:text-destructive"
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
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-ink">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription className="text-ink-muted">
              {editingCategory ? "Update category details" : "Fill in the details to create a new category"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-ink-soft">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-border bg-card text-ink"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-ink-soft">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-border bg-card text-ink"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-ink-soft">Cover image</Label>
              <ImageUploader
                max={1}
                folder="categories"
                value={form.image ? [form.image] : []}
                onChange={(urls) => setForm((f) => ({ ...f, image: urls[0] ?? "" }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-ink">Confirm Delete</DialogTitle>
            <DialogDescription className="text-ink-muted">
              Are you sure you want to delete &ldquo;{deletingCategory?.name}&rdquo;? Products in this
              category will become uncategorized.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
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
  );
}

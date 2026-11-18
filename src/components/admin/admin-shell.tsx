"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Package,
  ShoppingCart,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/logo";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Quotations", href: "/admin/quotations", icon: FileText },
  { label: "Custom orders", href: "/admin/custom-orders", icon: ClipboardList },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Orders (archive)", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <>
      <nav className="flex-1 space-y-0.5 px-3 py-5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-ink-soft hover:bg-bone hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-0.5 border-t px-3 py-4">
        <p className="truncate px-3 pb-2 text-xs text-ink-muted" title={email}>
          {email}
        </p>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-ink-soft hover:bg-bone hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-ink-soft hover:bg-bone hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-card lg:flex">
        <Link href="/admin/dashboard" className="flex h-16 items-center border-b px-6">
          <Logo className="w-[120px]" />
        </Link>
        {nav}
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin/dashboard">
          <Logo className="w-[104px]" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-sm hover:bg-bone"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-[drawer-in-left_0.4s_cubic-bezier(0.16,1,0.3,1)] flex-col bg-card shadow-xl">
            <div className="flex h-14 items-center border-b px-6">
              <Logo className="w-[104px]" />
            </div>
            {nav}
          </div>
        </div>
      )}

      <main className="px-4 py-8 sm:px-6 lg:ml-60 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

/** Consistent page heading for admin screens. */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

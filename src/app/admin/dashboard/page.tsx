"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, formatDate } from "@/lib/utils"
import { adminFetch } from "@/lib/admin-fetch"
import { Package, FolderOpen, ShoppingCart, DollarSign } from "lucide-react"

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalCategories: number
  totalRevenue: number
  recentOrders: {
    id: string
    customerName: string
    totalAmount: number
    status: string
    createdAt: string
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats")
        return res.json()
      })
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Overview of your store performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          loading={loading}
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          loading={loading}
        />
        <StatCard
          icon={FolderOpen}
          label="Total Categories"
          value={stats?.totalCategories ?? 0}
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats ? formatPrice(stats.totalRevenue) : "0"}
          loading={loading}
        />
      </div>

      <Card className="border-border bg-[#1A1A1A]">
        <CardHeader>
          <CardTitle className="text-lg text-white">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-gray-400">Customer</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell><Skeleton className="h-4 w-32 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 bg-white/5" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 bg-white/5" /></TableCell>
                    </TableRow>
                  ))
                : stats?.recentOrders?.map((order) => (
                    <TableRow key={order.id} className="border-border text-white">
                      <TableCell className="font-medium">{order.customerName}</TableCell>
                      <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {formatDate(new Date(order.createdAt))}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  loading: boolean
}) {
  return (
    <Card className="border-border bg-[#1A1A1A]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{label}</CardTitle>
        <Icon className="h-4 w-4 text-gold" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24 bg-white/5" />
        ) : (
          <p className="text-2xl font-bold text-white">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Completed: "bg-green-500/20 text-green-400 border-green-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <Badge variant="outline" className={colorMap[status] || "border-border text-gray-400"}>
      {status}
    </Badge>
  )
}

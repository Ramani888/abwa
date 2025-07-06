"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useMemo } from "react"

function filterOrdersByPeriod(orders: any[], period: string) {
  const now = new Date()
  if (!orders) return []
  if (period === "current-month") {
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }
  if (period === "last-month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
    })
  }
  if (period === "last-3-months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "last-6-months") {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "year-to-date") {
    const start = new Date(now.getFullYear(), 0, 1)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= now
    })
  }
  if (period === "last-year") {
    const start = new Date(now.getFullYear() - 1, 0, 1)
    const end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
    return orders.filter(order => {
      const date = new Date(order?.captureDate ?? order?.createdAt)
      return date >= start && date <= end
    })
  }
  // For "custom", you can add your own logic or return all for now
  return orders
}

export function ProductReportTable({ selectedPeriod }: { selectedPeriod: string }) {
  const { products, loading: productLoading } = useSelector((state: RootState) => state.products)
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  // Filter orders by selectedPeriod
  const filteredOrders = useMemo(
    () => filterOrdersByPeriod(orders, selectedPeriod),
    [orders, selectedPeriod]
  )

  // Aggregate product report data
  const productReports = useMemo(() => {
    if (productLoading || orderLoading || !products || !filteredOrders) return []

    return products.map((product: any) => {
      let sold = 0
      let revenue = 0
      let profit = 0

      // Aggregate over filtered orders for this product
      filteredOrders.forEach((order: any) => {
        order.products?.forEach((item: any) => {
          if (item.productId === product._id) {
            sold += item.quantity
            revenue += item.price * item.quantity
            // Assume profit = (price - purchasePrice) * quantity
            const variant = product.variants?.find((v: any) => v._id === item.variantId)
            const purchasePrice = variant?.purchasePrice ?? 0
            profit += (item.price - purchasePrice) * item.quantity
          }
        })
      })

      const profitMargin = revenue > 0 ? ((profit / revenue) * 100) : 0

      return {
        id: product._id,
        name: product.name,
        category: product.categoryName || "",
        sold,
        revenue: `₹${revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        profit: `₹${profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        profitMargin: Number(profitMargin.toFixed(1)),
      }
    })
  }, [products, filteredOrders, productLoading, orderLoading])

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Profit Margin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productReports.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">{product.sold}</TableCell>
              <TableCell className="text-right">{product.revenue}</TableCell>
              <TableCell className="text-right">{product.profit}</TableCell>
              <TableCell className="w-[120px]">
                <div className="flex flex-col gap-1">
                  <Progress value={product.profitMargin} />
                  <span className="text-xs text-muted-foreground">{product.profitMargin}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"

// Helper to get initials from name or email
function getInitials(name: string, email: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

// Helper to format date as "x hours ago", "Yesterday", etc.
function getRelativeDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return "Just now"
  if (diffHours === 1) return "1 hour ago"
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffHours < 48) return "Yesterday"
  return `${Math.floor(diffHours / 24)} days ago`
}

export function RecentSales() {
  const { orders, loading: orderLoading } = useSelector((state: RootState) => state.orders)

  // Map orders to recentSales format, sort by date descending, limit to 5
  const recentSales = (orders || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.captureDate ?? 0).getTime() -
        new Date(a?.captureDate ?? 0).getTime()
    )
    .slice(0, 5)
    .map((order) => ({
      _id: order?._id,
      name: order?.customerData?.name || "Unknown",
      email: order?.customerData?.email || "unknown@example.com",
      amount: `₹${order.total?.toLocaleString() || "0.00"}`,
      date: order.createdAt ? getRelativeDate(order?.captureDate ? String(order.captureDate) : "") : "",
      initials: getInitials(order?.customerData?.name, order?.customerData?.email),
    }))

  return (
    <div className="space-y-8">
      {recentSales.length === 0 ? (
        <div className="text-muted-foreground text-center">No recent sales</div>
      ) : (
        recentSales.map((sale) => (
          <div key={sale?._id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`/placeholder-user.jpg`} alt={sale.name} />
              <AvatarFallback>{sale.initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">{sale.amount}</div>
          </div>
        ))
      )}
    </div>
  )
}


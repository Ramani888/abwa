import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for recent sales
const recentSales = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    amount: "₹2,500.00",
    date: "2 hours ago",
    initials: "RS",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya@example.com",
    amount: "₹1,800.00",
    date: "5 hours ago",
    initials: "PP",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit@example.com",
    amount: "₹950.00",
    date: "Yesterday",
    initials: "AK",
  },
  {
    id: "4",
    name: "Neha Singh",
    email: "neha@example.com",
    amount: "₹3,200.00",
    date: "Yesterday",
    initials: "NS",
  },
  {
    id: "5",
    name: "Vikram Reddy",
    email: "vikram@example.com",
    amount: "₹1,200.00",
    date: "2 days ago",
    initials: "VR",
  },
]

export function RecentSales() {
  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
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
      ))}
    </div>
  )
}


import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Link href="/dashboard/orders/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <OrdersTable />
    </div>
  )
}


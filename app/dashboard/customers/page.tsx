import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { CustomersTable } from "@/components/dashboard/customers-table"

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Link href="/dashboard/customers/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <CustomersTable />
    </div>
  )
}


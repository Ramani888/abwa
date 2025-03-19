import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CategoriesTable } from "@/components/dashboard/categories-table"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage product categories for your inventory.</p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoriesTable />
    </div>
  )
}


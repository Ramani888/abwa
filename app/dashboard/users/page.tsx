import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { UsersTable } from "@/components/dashboard/users-table"
import { PlanLimitsAlert } from "@/components/dashboard/plan-limits-alert"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Staff Users</h2>
        <div className="flex gap-2">
          <Link href="/dashboard/users/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      <PlanLimitsAlert resourceType="users" showWhen="approaching" />

      <UsersTable />
    </div>
  )
}


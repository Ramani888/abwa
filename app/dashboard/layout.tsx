import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PlanProvider } from "@/components/dashboard/plan-context"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <PlanProvider>
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </PlanProvider>
  )
}


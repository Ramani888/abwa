"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  BarChart,
  Settings,
  Package,
  Database,
  User,
  Layers,
  Store,
  Bell,
  Crown,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlanBadge } from "./plan-badge"
import { usePlan } from "./plan-context"
import { useAuth } from "../auth-provider"

interface DashboardSidebarProps {
  isMobile?: boolean
  closeMobileMenu?: () => void
}

export function DashboardSidebar({ isMobile = false, closeMobileMenu }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { currentPlan } = usePlan()
  const { owner } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Layers,
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Stock",
      href: "/dashboard/stock",
      icon: Database,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: User,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Plans",
      href: "/dashboard/plans",
      icon: Crown,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const handleClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu()
    }
  }

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", isMobile ? "w-full" : "hidden md:flex")}>
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                pathname === item.href && "bg-muted font-medium text-primary",
                pathname.startsWith(item.href) && item.href !== "/dashboard" && "bg-muted font-medium text-primary",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground uppercase">
              {(owner?.shop?.name?.[0] ?? '') + (owner?.shop?.name?.[1] ?? '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-medium capitalize">{owner?.shop?.name}</h4>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground truncate">Manage your shop</p>
              <PlanBadge className="ml-1 text-[10px] py-0 h-4" plan={currentPlan} />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-3 w-3" />
            <span className="truncate">{owner?.shop?.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span>GST: {owner?.shop?.gst}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


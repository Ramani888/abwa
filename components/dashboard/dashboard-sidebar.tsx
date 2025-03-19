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
} from "lucide-react"

interface DashboardSidebarProps {
  isMobile?: boolean
  closeMobileMenu?: () => void
}

export function DashboardSidebar({ isMobile = false, closeMobileMenu }: DashboardSidebarProps) {
  const pathname = usePathname()

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
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background overflow-hidden",
        isMobile ? "w-full" : "hidden md:flex",
      )}
    >
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={handleClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
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
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 text-sm font-medium">Green Harvest Agro Shop</h4>
          <p className="text-xs text-muted-foreground">Manage your shop, inventory, and customers all in one place.</p>
        </div>
      </div>
    </div>
  )
}


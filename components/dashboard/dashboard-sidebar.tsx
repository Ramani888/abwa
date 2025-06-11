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
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlanBadge } from "./plan-badge"
import { usePlan } from "./plan-context"
import { useAuth } from "../auth-provider"
import { usePermission } from "@/hooks/usePermission"
import { Permissions } from "@/utils/consts/permission"
import { useState } from "react"

interface DashboardSidebarProps {
  isMobile?: boolean
  closeMobileMenu?: () => void
}

export function DashboardSidebar({ isMobile = false, closeMobileMenu }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { currentPlan } = usePlan()
  const { owner } = useAuth();
  const { hasPermission } = usePermission();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  type NavItem = {
    title: string;
    href: string;
    icon: React.ElementType;
    permission: boolean;
    children?: {
      title: string;
      href: string;
      permission: boolean;
    }[];
  };

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      permission: true,
    },
    {
      title: "Suppliers",
      href: "/dashboard/suppliers",
      icon: Store,
      permission: hasPermission(Permissions.VIEW_SUPPLIER),
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
      permission: hasPermission(Permissions.VIEW_PRODUCT),
    },
    {
      title: "Categories",
      href: "/dashboard/categories",
      icon: Layers,
      permission: hasPermission(Permissions.VIEW_CATEGORY)
    },
    {
      title: "Sales Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      permission: hasPermission(Permissions.VIEW_ORDER),
    },
    {
      title: "Purchase Orders",
      href: "/dashboard/purchase-order",
      icon: ShoppingCart,
      permission: hasPermission(Permissions.VIEW_PURCHASE_ORDER),
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      permission: hasPermission(Permissions.VIEW_CUSTOMER),
    },
    {
      title: "Customer Payments",
      href: "/dashboard/customer-payment",
      icon: Users,
      permission: hasPermission(Permissions.VIEW_CUSTOMER),
    },
    {
      title: "Stock",
      href: "/dashboard/stock",
      icon: Database,
      permission: true
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: User,
      permission: hasPermission(Permissions.VIEW_USER),
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      permission: true
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
      permission: true
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      permission: true
    },
    {
      title: "Plans",
      href: "/dashboard/plans",
      icon: Crown,
      permission: true
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      permission: true
    },
  ]

  const handleClick = () => {
    if (isMobile && closeMobileMenu) {
      closeMobileMenu()
    }
  }

  const handleSubmenuToggle = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r bg-background", isMobile ? "w-full" : "hidden md:flex")}>
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => {
            if (!item.permission) return null
            if (item?.children && item?.children.length > 0) {
              const isOpen = openSubmenu === item.href;
              return (
                <div key={index}>
                  <button
                    type="button"
                    onClick={() => handleSubmenuToggle(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                      (pathname === item.href || pathname.startsWith(item.href) && item.href !== "/dashboard") && "bg-muted font-medium text-primary",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    <span className="ml-auto flex items-center">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="ml-6">
                      {item?.children.map((child, childIdx) => {
                        if (!child.permission) return null
                        return (
                          <Link
                            key={childIdx}
                            href={child.href}
                            onClick={handleClick}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                              pathname === child.href && "bg-muted font-medium text-primary"
                            )}
                          >
                            <span>{child.title}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            return (
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
            )
          })}
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


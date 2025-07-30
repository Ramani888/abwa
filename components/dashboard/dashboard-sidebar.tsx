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
  ChevronRight,
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
  const { hasPermission, hasAnyPermission } = usePermission();
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
      permission: hasAnyPermission([Permissions.VIEW_SUPPLIER, Permissions.VIEW_SUPPLIER_PAYMENT]),
      children: [
        {
          title: "All Suppliers",
          href: "/dashboard/suppliers",
          permission: hasPermission(Permissions.VIEW_SUPPLIER),
        },
        {
          title: "Supplier Payments",
          href: "/dashboard/supplier-payment",
          permission: hasPermission(Permissions.VIEW_SUPPLIER_PAYMENT),
        },
      ],
    },
    {
      title: "Products",
      href: "/dashboard/products",
      icon: Package,
      permission: hasAnyPermission([Permissions.VIEW_PRODUCT, Permissions.VIEW_CATEGORY]),
      children: [
        {
          title: "All Products",
          href: "/dashboard/products",
          permission: hasPermission(Permissions.VIEW_PRODUCT),
        },
        {
          title: "Categories",
          href: "/dashboard/categories",
          permission: hasPermission(Permissions.VIEW_CATEGORY),
        },
      ],
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
      permission: hasAnyPermission([Permissions.VIEW_CUSTOMER, Permissions.VIEW_CUSTOMER_PAYMENT]),
      children: [
        {
          title: "All Customers",
          href: "/dashboard/customers",
          permission: hasPermission(Permissions.VIEW_CUSTOMER),
        },
        {
          title: "Customer Payments",
          href: "/dashboard/customer-payment",
          permission: hasPermission(Permissions.VIEW_CUSTOMER_PAYMENT),
        },
      ],
    },
    {
      title: "Stock",
      href: "/dashboard/stock",
      icon: Database,
      permission: true,
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
      permission: true,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart,
      permission: true,
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
                <div key={index} className="mb-1">
                  <button
                    type="button"
                    onClick={() => handleSubmenuToggle(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 mb-1 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                      ((pathname === item.href || (pathname?.startsWith(item.href) && item.href !== "/dashboard")) && "bg-muted font-medium text-primary"),
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    <span className="ml-auto flex items-center">
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                              "flex items-center gap-3 rounded-lg px-3 py-2 mb-1 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 mb-1 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                  pathname === item.href && "bg-muted font-medium text-primary",
                  (pathname?.startsWith(item.href)) && item.href !== "/dashboard" && "bg-muted font-medium text-primary",
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
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12 shadow-lg ring-2 ring-primary/40">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground uppercase text-xl font-extrabold">
              {(owner?.shop?.name?.[0] ?? '') + (owner?.shop?.name?.[1] ?? '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-bold capitalize text-primary leading-tight">{owner?.shop?.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <PlanBadge className="text-[11px] h-5" plan={currentPlan} />
              {/* <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-medium shadow-sm">
                Manage your shop
              </span> */}
            </div>
          </div>
        </div>
        <div className="mt-2 grid gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="truncate font-semibold">{owner?.shop?.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-semibold">GST: {owner?.shop?.gst}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingBag, User, Settings, LogOut, Bell, Menu, Crown, WifiIcon, Wallet } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "./dashboard-sidebar"
import { PlanBadge } from "./plan-badge"
import { Badge } from "@/components/ui/badge"
import { usePlan } from "./plan-context"
import { useNotification } from "../notification-provider"
import { useNetworkStatus } from "../network-provider"

export function DashboardHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { currentPlan } = usePlan()
  const { unreadCount } = useNotification()
  const { isOnline, effectiveType, downlink } = useNetworkStatus()

  let wifiColor = "text-green-500"
  let wifiTitle = "Strong connection"

  if (!isOnline) {
    wifiColor = "text-gray-400"
    wifiTitle = "No internet connection"
  } else if (effectiveType === "2g" || (downlink !== undefined && downlink < 1)) {
    wifiColor = "text-red-500"
    wifiTitle = "Very weak connection"
  } else if (effectiveType === "3g" || (downlink !== undefined && downlink < 3)) {
    wifiColor = "text-yellow-500"
    wifiTitle = "Weak connection"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <DashboardSidebar isMobile={true} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>AgroBill</span>
        </Link>

        <div className="ml-4 hidden md:block">
          <PlanBadge />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span
            title={wifiTitle}
            className="flex items-center justify-center border rounded-full bg-background p-2"
          >
            <WifiIcon className={`h-6 w-6 ${wifiColor}`} />
          </span>
          <Link href="/dashboard/notifications">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/plans">
                  <Crown className="mr-2 h-4 w-4" />
                  Subscription Plan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/expense">
                  <Wallet className="mr-2 h-4 w-4" />
                  Expense
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}


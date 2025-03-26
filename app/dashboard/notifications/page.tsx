"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, ShoppingCart, Database, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

// Static notification data
const notifications = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-056 has been placed by Rahul Sharma",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "stock",
    title: "Low Stock Alert",
    message: "Pesticide Spray is running low (5 units remaining)",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Received",
    message: "Payment of ₹3,200 received for order #ORD-042",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "System Update",
    message: "AgroBill will be updated tonight at 2:00 AM",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "order",
    title: "Order Completed",
    message: "Order #ORD-039 has been marked as completed",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "stock",
    title: "Out of Stock Alert",
    message: "Drip Irrigation Kit is now out of stock",
    time: "2 days ago",
    read: true,
  },
  {
    id: "7",
    type: "payment",
    title: "Payment Due Reminder",
    message: "Payment for order #ORD-035 is due in 2 days",
    time: "3 days ago",
    read: true,
  },
  {
    id: "8",
    type: "system",
    title: "Plan Upgrade Successful",
    message: "Your subscription has been upgraded to Standard Plan",
    time: "5 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notificationState, setNotificationState] = useState(notifications)

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notificationState.filter((notification) => !notification.read).length

  const markAllAsRead = () => {
    setNotificationState(notificationState.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotificationState(
      notificationState.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
  }

  const deleteNotification = (id: string) => {
    setNotificationState(notificationState.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />
      case "stock":
        return <Database className="h-5 w-5 text-amber-500" />
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "system":
        return <AlertTriangle className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Notifications</CardTitle>
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0} size="sm">
                Mark all as read
              </Button>
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all" className="relative">
                  All
                  {unreadCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="order">Orders</TabsTrigger>
                <TabsTrigger value="stock">Stock</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-4 rounded-lg border p-4 transition-colors",
                    !notification.read && "bg-muted/50",
                  )}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{notification.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "all"
                    ? "You don't have any notifications yet"
                    : activeTab === "unread"
                      ? "You don't have any unread notifications"
                      : `You don't have any ${activeTab} notifications`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


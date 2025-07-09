"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, ShoppingCart, Database, Trash, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { serverDeleteNotification, serverUpdateNotification } from "@/services/serverApi"
import { useState } from "react"
import { useNotification } from "@/components/notification-provider"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { notifications, unreadCount, refreshNotifications, loading } = useNotification()

  const filteredNotifications = notifications?.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type === activeTab
  })

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications?.filter(n => !n.isRead)
      await Promise.all(
        unreadNotifications.map(notification =>
          serverUpdateNotification(notification?._id?.toString() ?? "")
        )
      )
      refreshNotifications()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await serverUpdateNotification(id)
      refreshNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await serverDeleteNotification(id)
      refreshNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
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
    <div className="w-full px-2 sm:px-4 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl">Notifications</CardTitle>
              <Button
                variant="outline"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                size="sm"
                className="w-full sm:w-auto"
              >
                Mark all as read
              </Button>
            </div>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap scrollbar-thin">
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
            {loading ? (
              <div className="flex justify-center items-center space-x-2 py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Loading Notification...</span>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification?._id}
                  className={cn(
                    "flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 rounded-lg border p-3 sm:p-4 transition-colors",
                    !notification.isRead && "bg-muted/50",
                  )}
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="font-medium">{notification?.name}</p>
                      <div className="flex flex-row flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {notification?.createdAt
                            ? new Date(notification.createdAt).toLocaleString()
                            : ""}
                        </span>
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => markAsRead(notification?._id?.toString() ?? "")}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteNotification(notification?._id?.toString() ?? "")}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification?.description}</p>
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


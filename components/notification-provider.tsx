"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { serverGetNotification } from "@/services/serverApi"
import { INotification } from "@/types/notification"

type NotificationContextType = {
  notifications: INotification[]
  unreadCount: number
  loading: boolean
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  refreshNotifications: async () => {},
})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refreshNotifications = async () => {
    setLoading(true)
    try {
      const res = await serverGetNotification()
      const data = res?.data || []
      setNotifications(data)
      setUnreadCount(data.filter((n: any) => !n.isRead).length)
    } catch {
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshNotifications()
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}
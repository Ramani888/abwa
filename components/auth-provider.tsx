"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"

type User = {
  _id: string
  name: string
  email: string
  number: number
  password: string
  ownerId: string
  token: string
  createdAt: Date
  updatedAt: Date
} | null

type Shop = {
  _id: string
  name: string
  email: string
  number: number
  address: string
  gst: string
} | null

type Owner = {
  _id: string
  name: string
  email: string
  number: number
  password: string
  shop: Shop
  createdAt: Date
  updatedAt: Date
} | null

type AuthContextType = {
  user: User
  owner: Owner
  login: (userData: User, ownerData: Owner) => void
  logout: () => void,
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const publicRoutes = ["/login", "/register", "/"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [owner, setOwner] = useState<Owner>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedOwner = localStorage.getItem("owner")
    if (storedUser && storedOwner) {
      setUser(JSON.parse(storedUser))
      setOwner(JSON.parse(storedOwner))
      if (publicRoutes.includes(pathname)) {
        router.push("/dashboard") // redirect logged-in users away from login/signup
      }
    } else {
      setUser(null)
      setOwner(null)
      if (!publicRoutes.includes(pathname)) {
        router.push("/login") // redirect unauthenticated users to login
      }
    }
  }, [pathname])

  const login = (userData: User, ownerDate: Owner) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("owner", JSON.stringify(ownerDate))
    Cookies.set("auth-token", userData?.token ?? '', { expires: 30 })
    setOwner(ownerDate)
    setUser(userData)

    router.push("/dashboard") // redirect after login
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("owner")
    Cookies.remove("auth-token")
    setOwner(null)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, owner, login, logout, isAuthenticated: !!user, }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

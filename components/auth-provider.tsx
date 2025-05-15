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
import { set } from "date-fns"

type User = {
  _id: string
  name: string
  email: string
  number: number
  password: string
  ownerId: string
  token: string
  permissionData?: any[]
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
  permissions: string[]
  owner: Owner
  login: (userData: User, ownerData: Owner) => void
  logout: () => void,
  updateUser: (updatedUserData: Partial<Omit<User, 'token'>>) => void,
  updateOwner: (updatedOwnerData: Partial<Owner>) => void,
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const publicRoutes = ["/login", "/register", "/"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [owner, setOwner] = useState<Owner>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedOwner = localStorage.getItem("owner")
    if (storedUser && storedOwner) {
      setUser(JSON.parse(storedUser))
      setOwner(JSON.parse(storedOwner))
      const userData = JSON.parse(storedUser)
      const userPermission = userData?.permissionData?.map((item: any) => item?.permissionName)
      setPermissions(userPermission ?? [])
      if (publicRoutes.includes(pathname)) {
        router.push("/dashboard") // redirect logged-in users away from login/signup
      }
    } else {
      setUser(null)
      setPermissions([])
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
    const userPermission = userData?.permissionData?.map((item: any) => item?.permissionName)
    setPermissions(userPermission ?? [])

    router.push("/dashboard") // redirect after login
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("owner")
    Cookies.remove("auth-token")
    setOwner(null)
    setUser(null)
    setPermissions([])
    router.push("/login")
  }

  const updateUser = (updatedUserData: Partial<Omit<User, 'token'>>) => {
    if (!user) return;
    
    // Create the updated user by merging existing data with new data
    const newUserData = { 
      ...user, 
      ...updatedUserData,
      // Preserve the original token
      token: user.token
    };
    
    // Update state
    setUser(newUserData);
    const userPermission = newUserData?.permissionData?.map((item: any) => item?.permissionName)
    setPermissions(userPermission ?? [])
    
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(newUserData));
  }

  const updateOwner = (updatedOwnerData: Partial<Owner>) => {
    if (!owner) return;
    
    // Create the updated owner by merging existing data with new data
    const newOwnerData = { 
      ...owner, 
      ...updatedOwnerData
    };
    
    // Update state
    setOwner(newOwnerData);
    
    // Update localStorage
    localStorage.setItem("owner", JSON.stringify(newOwnerData));
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      permissions,
      owner, 
      login, 
      logout, 
      updateUser,
      updateOwner,
      isAuthenticated: !!user, 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

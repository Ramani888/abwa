"use client"
import { Toaster } from "sonner"
import { useTheme } from "@/components/theme-provider"

export default function ThemedToaster() {
  const { theme } = useTheme()
  return <Toaster richColors position="bottom-right" theme={theme} />
}
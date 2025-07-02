import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ReduxProvider } from "@/components/redux-provider"
import ThemedToaster from "@/components/themed-toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agro Billing System",
  description: "Management system for agricultural businesses",
  generator: 'v0.dev'
}

const themeInitScript = `
(function() {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    // Fail silently
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Prevents flash of incorrect theme on initial load */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ReduxProvider>
              <ThemedToaster />
              {children}
            </ReduxProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


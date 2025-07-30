"use client";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ReduxProvider } from "@/components/redux-provider";
import ThemedToaster from "@/components/themed-toaster";
import { NotificationProvider } from "@/components/notification-provider";
import { NetworkStatusProvider, useNetworkStatus } from "@/components/network-provider";
import { WifiIcon } from "lucide-react";

// Overlay and Popup
function NetworkOverlay() {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[9999] pointer-events-auto" />
      <div
        className="fixed left-0 right-0 bottom-8 mx-auto w-fit bg-red-600 text-white rounded-lg px-8 py-4 shadow-lg z-[10000] font-semibold text-lg flex items-center gap-3"
        role="alert"
        aria-live="assertive"
      >
        <span className="flex items-center justify-center rounded-full bg-white/20 p-2">
          <WifiIcon className="h-6 w-6 text-white" />
        </span>
        Network down. Please check your internet connection.
      </div>
    </>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReduxProvider>
          <NotificationProvider>
            <NetworkStatusProvider>
              <NetworkOverlay />
              <ThemedToaster />
              {children}
            </NetworkStatusProvider>
          </NotificationProvider>
        </ReduxProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
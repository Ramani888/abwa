"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

type NetworkStatusContextType = {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
};

const NetworkStatusContext = createContext<NetworkStatusContextType>({ isOnline: true });

export const useNetworkStatus = () => useContext(NetworkStatusContext);

export const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(
    typeof window === "undefined" ? true : navigator.onLine
  );
  const [effectiveType, setEffectiveType] = useState<string | undefined>(undefined);
  const [downlink, setDownlink] = useState<number | undefined>(undefined);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Network accuracy (connection) API
    const nav = navigator as any;
    function updateConnection() {
      if (nav.connection) {
        setEffectiveType(nav.connection.effectiveType);
        setDownlink(nav.connection.downlink);
      }
    }
    updateConnection();
    if (nav.connection) {
      nav.connection.addEventListener("change", updateConnection);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (nav.connection) {
        nav.connection.removeEventListener("change", updateConnection);
      }
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline, effectiveType, downlink }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
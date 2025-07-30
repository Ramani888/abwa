"use client"
import React, { createContext, useContext, useEffect, useState } from "react";

type NetworkStatusContextType = {
  isOnline: boolean;
};

const NetworkStatusContext = createContext<NetworkStatusContextType>({ isOnline: true });

export const useNetworkStatus = () => useContext(NetworkStatusContext);

export const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(typeof window === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "sidebar";

interface SidebarContext {
  open: boolean;
  width: string;
  toggleSidebar: (isCustom?: boolean) => void;
  collapseSidebar: () => void;
  isLoading: boolean;
}

const SidebarContext = createContext<SidebarContext | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SIDEBAR_EXPANDED_WIDTH = "10rem";
export const SIDEBAR_COLLAPSED_WIDTH = "4rem";

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [open, setOpen] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [width, setWidth] = useState<string>(SIDEBAR_EXPANDED_WIDTH);

  useEffect(() => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (value) {
      setOpen(JSON.parse(value) === true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setWidth(open ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH);
  }, [open]);

  const toggleSidebar = (isCustom?: boolean) => {
    if (isCustom) {
      setOpen(true);
    } else {
      setOpen((value) => {
        const newState = !value;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    }
  };

  const collapseSidebar = () => {
    setOpen(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <SidebarContext.Provider
      value={{ open, width, toggleSidebar, collapseSidebar, isLoading }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

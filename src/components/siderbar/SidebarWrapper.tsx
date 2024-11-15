"use client";

import { useSidebar } from "~/hooks/useSidebar";
import * as React from "react";
import MobileNav from "~/components/siderbar/MobileNav";
import { cn } from "~/lib/utils";
import Sidebar from "./Sidebar";

interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarWrapper = ({ children }: SidebarProviderProps) => {
  const { width } = useSidebar();

  return (
    <div className="min-h-screen gap-2 md:gap-0 ">
      <div className="relative md:m-0 lg:hidden">
        <MobileNav />
        <div>{children}</div>
      </div>
      <div className="hidden lg:block">
        <Sidebar />
        <div
          style={{ marginLeft: `${width}` }}
          className={cn("transition-all")}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarWrapper;

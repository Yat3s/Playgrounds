"use client";

import { useSidebar } from "~/hooks/useSidebar";
import { CollapseSidebarIcon, ExpandSidebarIcon } from "../common/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useTranslation } from "react-i18next";
import { sendGAEvent } from "@next/third-parties/google";

export function SidebarToggle() {
  const { t } = useTranslation();
  const { toggleSidebar, open: isSidebarOpen } = useSidebar();

  return (
    <div
      className="hidden cursor-pointer md:flex"
      onClick={() => {
        toggleSidebar();
        sendGAEvent({ event: "sideBarToggleClicked", value: `${Date.now()}` });
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {isSidebarOpen ? (
              <CollapseSidebarIcon className="h-6 w-6 rotate-180 transform text-muted-foreground hover:text-muted-foreground/50" />
            ) : (
              <ExpandSidebarIcon className="h-6 w-6 text-muted-foreground hover:text-muted-foreground/50" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{t(isSidebarOpen ? "Close Sidebar" : "Open Sidebar")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

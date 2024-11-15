"use client";

import { useSidebar } from "~/hooks/useSidebar";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";

const UserAccountCard = () => {
  const { open: isSidebarOpen } = useSidebar();
  const { data: session } = useSession();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-2 transition-all duration-200",
        isSidebarOpen
          ? "rounded-xl border border-muted-foreground/30 p-3 hover:bg-white/15"
          : "border-none duration-500",
      )}
    >
      <div className="bg-custom-gradient h-8 w-8 rounded-full" />
      {isSidebarOpen && (
        <div className="flex w-[4rem] flex-col text-xs text-[#B8B8B8]">
          <span className="max-w-[6.5rem] truncate">
            {session
              ? session.user.email ?? session.user.phoneNumber
              : t("Sign In")}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAccountCard;

"use client";

import { useSidebar } from "~/hooks/useSidebar";
import { MessageSquareMore } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AppsTabIcon, LogoIcon, ModelTabIcon } from "~/components/common/Icons";
import { SidebarToggle } from "~/components/siderbar/SidebarToggle";
import UserAccountNav from "~/components/user/UserAccountNav";
import { cn } from "~/lib/utils";
import CustomLink from "../common/CustomLink";

export const navLinks = [
  {
    name: "Models",
    path: "/models",
    icon: <ModelTabIcon />,
    disabled: false,
    thirdParty: false,
  },
  {
    name: "Apps",
    path: "/apps",
    icon: <AppsTabIcon />,
    disabled: true,
    thirdParty: false,
  },
  {
    name: "Chat",
    path: "https://composal.ai",
    icon: <MessageSquareMore />,
    disabled: false,
    thirdParty: true,
  },
];

const Sidebar = () => {
  const pathname = `/${usePathname().split("/").pop()}`;
  const { open, width } = useSidebar();
  const { t } = useTranslation();

  return (
    <div
      style={{ width: width }} // it's a workaround for the Tailwind CSS JIT issue
      className={cn(
        "fixed left-0 top-0 z-10 flex min-h-screen flex-col items-center border-r border-muted-foreground/20 bg-background  px-4 py-8 text-muted-foreground transition-all duration-200",
      )}
    >
      <div className="flex justify-between gap-12">
        {open && (
          <CustomLink href="/" className={cn("flex gap-1")}>
            <LogoIcon className="h-10 w-10" />
          </CustomLink>
        )}
        <SidebarToggle />
      </div>

      <div className={cn("mt-16 flex flex-col items-start gap-6")}>
        {navLinks.map((item) => (
          <CustomLink
            className={cn(
              "flex items-start gap-4 text-base",
              item.path === pathname
                ? "text-white"
                : "text-white/40 hover:text-white/90",
            )}
            key={item.name}
            href={item.path}
            target={item.thirdParty ? "_blank" : "_self"}
          >
            {item.icon}
            {open && (
              <span className={cn(pathname === item.path ? "font-bold" : "")}>
                {t(item.name)}
              </span>
            )}
          </CustomLink>
        ))}
      </div>

      <div className={cn("mt-auto")}>
        <UserAccountNav />
      </div>
    </div>
  );
};

export default Sidebar;

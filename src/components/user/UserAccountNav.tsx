"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useModal } from "~/hooks/useStore";
import { sendGAEvent } from "@next/third-parties/google";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";
import { CreditIcon, SignOutIcon, UserIcon } from "../common/Icons";
import UserAccountCard from "./UserAccountCard";
import UserProfileModal from "./UserProfile";
import { useState } from "react";

const UserAccountNav = () => {
  const { t } = useTranslation();
  const { isUserProfileModalOpen, toggleAuthModal, toggleUserProfileModal } =
    useModal();
  const { data: session, status } = useSession();
  const phoneNumber = session?.user.phoneNumber;
  const email = session?.user.email;
  const [open, setOpen] = useState(false);

  const { data } = api.user.fetchCredits.useQuery();

  const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    sendGAEvent({
      event: "userAccountCardClicked",
      value: `${Date.now()}`,
    });
    if (!session && status !== "loading") {
      e.preventDefault();
      e.stopPropagation();
      toggleAuthModal(true);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const handleAccountSettingsClick = () => {
    toggleUserProfileModal(true);
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="overflow-visible">
          <div onClick={handleTriggerClick}>
            <UserAccountCard />
          </div>
        </DropdownMenuTrigger>

        {session && open && (
          <DropdownMenuContent
            className="mb-1 flex flex-col rounded-xl p-6"
            align="start"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-custom-gradient h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <p className="max-w-[9rem] truncate text-lg font-semibold">
                  {email ?? phoneNumber}
                </p>
                <div className="flex items-center gap-1">
                  <CreditIcon className="h-4 w-4" />
                  <p className="text-sm">
                    {t("Credit")}：
                    <span className="font-semibold">
                      {data && data.credits}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={handleAccountSettingsClick}
            >
              <UserIcon />
              <span className="text-sm text-foreground/80 hover:font-semibold hover:text-foreground">
                {t("Account Settings")}
              </span>
            </div>
            <DropdownMenuSeparator className="my-4 h-px bg-muted-foreground" />
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => signOut()}
            >
              <SignOutIcon />
              <span className="text-sm text-foreground/80 hover:font-semibold hover:text-foreground">
                {t("Sign Out")}
              </span>
            </div>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      {isUserProfileModalOpen && <UserProfileModal />}
    </>
  );
};

export default UserAccountNav;

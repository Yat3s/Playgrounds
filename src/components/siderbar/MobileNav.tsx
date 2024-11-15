"use client";

import { ArrowRight, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useModal } from "~/hooks/useStore";
import { ActiveUserAccountIcon } from "~/components/common/Icons";
import { api } from "~/trpc/react";
import { Sheet, SheetContent } from "../ui/sheet";
import { useTranslation } from "react-i18next";
import { sendGAEvent } from "@next/third-parties/google";
import CustomLink from "../common/CustomLink";

const MobileNav = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const phoneNumber = session?.user.phoneNumber;
  const email = session?.user.email;

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const pathname = usePathname();
  const { data } = api.user.fetchCredits.useQuery();
  const { toggleAuthModal, toggleUserProfileModal } = useModal();
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  React.useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };

  return (
    <div className="bg-background lg:hidden" ref={ref}>
      <div className="fixed left-0 right-0 top-0 z-50 bg-background p-2">
        <Menu onClick={toggleOpen} className="h-6 w-6 text-muted-foreground" />
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={"left"}>
          <div className="flex h-full flex-col p-4">
            {session ? (
              <div onClick={() => toggleUserProfileModal(true)}>
                <div className="flex items-center gap-1 font-semibold ">
                  <ActiveUserAccountIcon />
                  {email ? <span>{email}</span> : <span>{phoneNumber}</span>}
                </div>
                <div className="my-3 h-px w-full " />
                <div className="flex items-center font-semibold ">
                  {data?.credits && (
                    <span className="font-bold">
                      {t("Credit")}: {data.credits}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => {
                    toggleAuthModal(true);
                    sendGAEvent({
                      event: "signInModalOpen",
                      value: `${Date.now()}`,
                    });
                  }}
                  className="flex w-full cursor-pointer items-center font-semibold "
                >
                  {t("Sign In")} <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </>
            )}

            <div className="my-3 h-px w-full bg-muted-foreground" />
            <div className="flex items-center font-semibold">
              <CustomLink
                onClick={() => closeOnCurrent("/models")}
                className="flex items-center font-semibold "
                href="/models"
              >
                {t("Models")}
              </CustomLink>
            </div>
            <div className="my-3 h-px w-full bg-muted-foreground" />
            <div>
              <CustomLink
                onClick={() => closeOnCurrent("/apps")}
                className="flex items-center font-semibold "
                href="/apps"
              >
                {t("Apps")}
              </CustomLink>
            </div>
            {session && (
              <div
                onClick={() => {
                  signOut();
                  sendGAEvent({ event: "signOut", value: `${Date.now()}` });
                }}
                className="flex w-full flex-1 cursor-pointer items-end justify-end font-semibold "
              >
                {t("Sign Out")}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;

"use client";

import useNavigation from "~/hooks/useNavigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CmsSidebar from "~/components/cms/CmsSidebar";

export const ROLE_ADMIN = 1024;
export const ROLE_SUPER_ADMIN = 10241;

export default function CmsLayout({
  children,
  sideBarKey,
  superAdmin = false,
}: {
  children: React.ReactNode;
  sideBarKey: string;
  superAdmin?: boolean;
}) {
  const [selectedMenu, setSelectedMenu] = useState(sideBarKey);
  const { data: session, status } = useSession();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (
      !session ||
      !session.user.role ||
      session.user.role < ROLE_ADMIN ||
      (superAdmin && session.user.role < ROLE_SUPER_ADMIN)
    ) {
      navigate("/");
    }
  }, [session]);

  return (
    <>
      {(session?.user.role ?? 0) >= ROLE_ADMIN && (
        <div className="flex h-screen overflow-hidden bg-background">
          <CmsSidebar
            selectedMenu={selectedMenu}
            onSelectMenu={setSelectedMenu}
          />
          <div className="flex flex-1 flex-col overflow-auto p-8">
            {children}
          </div>
        </div>
      )}
    </>
  );
}

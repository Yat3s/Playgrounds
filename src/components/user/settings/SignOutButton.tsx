"use client";

import { signOut } from "next-auth/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { sendGAEvent } from "@next/third-parties/google";

const SignOutButton = () => {
  const { t } = useTranslation();

  const handleSignOut = () => {
    signOut();
    sendGAEvent({ event: "signOut", value: `${Date.now()}` });
  };

  return (
    <Button onClick={handleSignOut} className="w-fit text-xs sm:text-sm">
      {t("Sign Out")}
    </Button>
  );
};

export default SignOutButton;

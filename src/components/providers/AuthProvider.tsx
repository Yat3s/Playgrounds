"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import AuthModal from "~/components/auth/AuthModal";
import ContactModal from "~/components/modals/ContactModal";
import SignInModal from "~/components/modals/SignInModal";

interface ChildrenProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: ChildrenProps) {
  return (
    <SessionProvider>
      {children}
      <AuthModal />
      <SignInModal />
      <ContactModal />
    </SessionProvider>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useModal } from "~/hooks/useStore";
import useNavigation from "./useNavigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { isAuthModalOpen, toggleAuthModal } = useModal();
  const { navigate } = useNavigation();

  useEffect(() => {
    const protectRoutes = async () => {
      if (status === "loading") return;

      if (!session) {
        navigate("/");

        if (!isAuthModalOpen) {
          toggleAuthModal(true);
        }
      }
    };

    protectRoutes();
  }, [session, status, isAuthModalOpen, toggleAuthModal]);
};

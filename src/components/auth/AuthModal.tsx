"use client";

import { useModal } from "~/hooks/useStore";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import AuthFormContent from "~/components/auth/AuthFormContent";

const AuthModal = () => {
  const { isAuthModalOpen, toggleAuthModal } = useModal();

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={toggleAuthModal}>
      <DialogContent className="max-w-[380px] rounded-lg md:max-w-[420px] md:rounded-xl">
        <AuthFormContent />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

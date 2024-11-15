import { create } from "zustand";
import { ModelStatus } from "~/lib/enums";

type ModalStore = {
  isAuthModalOpen: boolean;
  isUserProfileModalOpen: boolean;
  isSignInModalOpen: boolean;
  isContactModalOpen: boolean;
  toggleAuthModal: (isAuthModalOpen: boolean) => void;
  toggleUserProfileModal: (isUserProfileModalOpen: boolean) => void;
  toggleSignInModal: (isSignInModalOpen: boolean) => void;
  toggleContactModal: (isContactModalOpen: boolean) => void;
};

type ModelStatusStore = {
  modelStatus: ModelStatus | null;
  setModelStatus: (status: ModelStatus | null) => void;
};

const useModal = create<ModalStore>((set) => ({
  isAuthModalOpen: false,
  isUserProfileModalOpen: false,
  isSignInModalOpen: false,
  isContactModalOpen: false,
  toggleAuthModal: (isAuthModalOpen: boolean) => set({ isAuthModalOpen }),
  toggleUserProfileModal: (isUserProfileModalOpen: boolean) =>
    set({ isUserProfileModalOpen }),
  toggleSignInModal: (isSignInModalOpen: boolean) => set({ isSignInModalOpen }),
  toggleContactModal: (isContactModalOpen: boolean) =>
    set({ isContactModalOpen }),
}));

const useModelStatus = create<ModelStatusStore>((set) => ({
  modelStatus: null,
  setModelStatus: (status) => set({ modelStatus: status }),
}));

export { useModal, useModelStatus };

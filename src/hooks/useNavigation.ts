"use client";

import { useRouter } from "next/navigation";
import { isIncompatibleBrowser } from "~/lib/utils";

const useNavigation = () => {
  const router = useRouter();

  const navigate = (pathname: string) => {
    if (isIncompatibleBrowser()) {
      window.location.assign(pathname);
      console.warn("Incompatible browser detected. Redirecting to", pathname);
    } else {
      router.push(pathname);
    }
  };

  const replace = (pathname: string) => {
    if (isIncompatibleBrowser()) {
      window.location.replace(pathname);
      console.warn("Incompatible browser detected. Replacing to", pathname);
    } else {
      router.replace(pathname);
    }
  };

  const refresh = () => {
    if (isIncompatibleBrowser()) {
      window.location.reload();
      console.warn("Incompatible browser detected. Reloading page");
    } else {
      router.refresh();
    }
  };

  const goBack = () => {
    if (isIncompatibleBrowser()) {
      window.history.back();
      console.warn("Incompatible browser detected. Going back");
    } else {
      router.back();
    }
  };

  return {
    navigate,
    replace,
    refresh,
    goBack,
  };
};

export default useNavigation;

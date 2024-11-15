"use client";

import * as React from "react";
import { useModal } from "~/hooks/useStore";
import { Dialog, DialogContent } from "../ui/dialog";
import { CreditIcon } from "../common/Icons";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { AppConfig } from "~/lib/enums";
import { useTranslation } from "react-i18next";

const SignInModal = () => {
  const { t } = useTranslation();
  const { isSignInModalOpen, toggleSignInModal } = useModal();
  const { data: freeCreditsAmount } = api.config.fetchByKey.useQuery({
    key: AppConfig.Free_Credits_Amount,
  });

  return (
    <Dialog open={isSignInModalOpen} onOpenChange={toggleSignInModal}>
      <DialogContent className="h-[20rem] max-w-[380px] rounded-lg md:max-w-[420px] md:rounded-xl">
        {freeCreditsAmount && (
          <div className="flex flex-col items-center justify-center space-y-10">
            <h1 className="mr-2 flex items-center gap-1 font-bold">
              <CreditIcon />
              <span className="ml-3">X</span>
              <span className="text-2xl font-extrabold">
                {freeCreditsAmount}
              </span>
            </h1>
            <div className="flex flex-col items-center justify-center">
              <p>{t("Welcome to X Model")}</p>
              <p>
                {t("First sign-in rewards you with")}{" "}
                <span className="font-extrabold">{freeCreditsAmount}</span>{" "}
                {t("free credits")}
              </p>
            </div>
            <Button className="w-40" onClick={() => toggleSignInModal(false)}>
              {t("Got it")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;

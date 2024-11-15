"use client";

import * as React from "react";
import { useModal } from "~/hooks/useStore";
import { Dialog, DialogContent } from "../ui/dialog";
import { api } from "~/trpc/react";
import { AppConfig } from "~/lib/enums";
import { useTranslation } from "react-i18next";

const ContactModal = () => {
  const { t } = useTranslation();
  const { isContactModalOpen, toggleContactModal } = useModal();
  const { data: qrCodeUrl } = api.config.fetchByKey.useQuery({
    key: AppConfig.QR_Code_Url,
  });

  return (
    <Dialog open={isContactModalOpen} onOpenChange={toggleContactModal}>
      <DialogContent className="max-w-[380px] rounded-lg md:max-w-2xl md:rounded-xl">
        <div className="flex flex-col items-center p-6 py-8">
          {qrCodeUrl && (
            <img src={qrCodeUrl} className="h-52 w-52" alt="QR Code" />
          )}
          <h1 className="mt-8 text-2xl font-bold">
            {t("Join the Product Experience Officer Group")}!
          </h1>
          <p className="mb-6">({t("Limited to the first 100 people")})</p>
          <p>{t("Occasional credits giveaways within the group")}</p>
          <p>
            {t(
              "and you can experience the latest AI models as soon as possible",
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;

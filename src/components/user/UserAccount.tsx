"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";

const UserAccount = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const phoneNumber = session?.user.phoneNumber;
  const email = session?.user.email;
  const { data } = api.user.fetchCredits.useQuery();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-6 text-lg font-extrabold sm:text-2xl">
        {t("Account")}
      </h1>
      <div className="flex flex-col">
        <h2 className="text-sm text-muted-foreground sm:text-base">
          {t("Phone Number")}
        </h2>
        <span className="font-bold">{phoneNumber ? phoneNumber : "-"}</span>
      </div>
      <div className="flex flex-col">
        <h2 className="text-sm text-muted-foreground sm:text-base">
          {t("Email")}
        </h2>
        <span className="font-bold">{email ? email : "-"}</span>
      </div>
    </div>
  );
};

export default UserAccount;

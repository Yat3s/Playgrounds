"use client";

import { useTranslation } from "react-i18next";
import LanguageSelector from "~/components/user/settings/LanguageSelector";
import SignOutButton from "~/components/user/settings/SignOutButton";

const UserSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-6 text-lg font-extrabold sm:text-2xl">
        {t("Settings")}
      </h1>

      <div className="mb-6">
        <h2 className="mb-4 font-bold">{t("Language")}</h2>
        <LanguageSelector />
      </div>
      <SignOutButton />
    </div>
  );
};

export default UserSettings;

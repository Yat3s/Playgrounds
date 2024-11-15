"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import i18nConfig from "../../../../i18nConfig";
import { sendGAEvent } from "@next/third-parties/google";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useNavigation from "~/hooks/useNavigation";

export enum LanguageLocale {
  Chinese = "zh",
  English = "en",
}

const LanguageSelector = () => {
  const { navigate, refresh } = useNavigation();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const currentPathname = usePathname();

  const handleChange = (newLocale: string) => {
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      navigate("/" + newLocale + currentPathname);
    } else {
      navigate(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    sendGAEvent({ event: "localeChange", value: newLocale });

    refresh();
  };

  const renderLocale = (locale: string): string => {
    switch (locale) {
      case "zh":
        return "中文简";
      default:
        return "English";
    }
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className="focus:ring-none w-24 font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 dark:border-foreground">
        <SelectValue placeholder="Lang">
          {renderLocale(currentLocale)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="font-medium">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="zh">中文简</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

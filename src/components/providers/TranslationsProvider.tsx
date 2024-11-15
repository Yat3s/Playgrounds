"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "~/app/i18n";
import { createInstance } from "i18next";

interface TranslationsProviderProps {
  children: React.ReactNode;
  locale: string | undefined;
  namespaces: string[];
  resources: any;
}

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

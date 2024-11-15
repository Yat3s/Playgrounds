"use client";

import initTranslations from "~/app/i18n";
import TranslationsProvider from "~/components/providers/TranslationsProvider";

interface TranslationsRootProps {
  children: React.ReactNode;
  locale: string;
}

const namespaces = ["default"];

const TranslationsRoot = async ({
  children,
  locale,
}: TranslationsRootProps) => {
  const { resources } = await initTranslations(locale, namespaces);

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={namespaces}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
};

export default TranslationsRoot;

import "simplebar-react/dist/simplebar.min.css";
import "~/styles/globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";

import { dir } from "i18next";
import TailwindIndicator from "~/components/common/TailwindIndicator";
import TranslationsRoot from "~/components/common/TranslationsRoot";
import AuthProvider from "~/components/providers/AuthProvider";
import ThemesProvider from "~/components/providers/ThemesProvider";
import { Toaster } from "~/components/ui/sonner";
import { SidebarProvider } from "~/hooks/useSidebar";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";
import i18nConfig from "../../../i18nConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "X - Model",
  description: "X Model",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body
        className={cn(
          "bg-muted-foreground/5 bg-[url('/bg_grid.svg')] font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          <AuthProvider>
            <TranslationsRoot locale={locale}>
              <ThemesProvider>
                <Toaster />
                <SidebarProvider>
                  {children}
                  <TailwindIndicator />
                </SidebarProvider>
              </ThemesProvider>
            </TranslationsRoot>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
      <GoogleAnalytics gaId="G-3VPZMDD6TY" />
    </html>
  );
}

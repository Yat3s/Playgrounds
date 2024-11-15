"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

const settings = [
  {
    name: "system",
    desc: "跟随系统",
    img: "",
  },
  {
    name: "light",
    desc: "浅色模式",
    img: "",
  },
  {
    name: "dark",
    desc: "深色模式",
    img: "",
  },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [_, startTransition] = React.useTransition();
  const { t } = useTranslation();

  const handleThemeChange = (selectedTheme: string) => {
    startTransition(() => {
      setTheme(selectedTheme);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold">{t("Appearance")}</h2>
      <div className="flex flex-col gap-4 sm:flex-row">
        {settings.map((item) => (
          <div
            key={item.desc}
            onClick={() => handleThemeChange(item.name)}
            className={cn("cursor-pointer rounded bg-muted p-2 text-center", {
              "ring-2 ring-foreground": theme === item.name,
            })}
          >
            <span className="text-sm">{t(item.desc)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;

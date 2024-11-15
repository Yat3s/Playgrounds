"use client";

import { PlayIcon } from "../common/Icons";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "../user/settings/LanguageSelector";
import useNavigation from "~/hooks/useNavigation";

export type AiModel = {
  id: string;
  name: string;
  nameZh: string | null;
  desc: string;
  descZh: string | null;
  tags: string[];
  runOn: string | null;
  runCount: number;
  cost: number;
  author: string | null;
  imgUrl: string | null;
  categories: {
    id: string;
  }[];
};

const ModelItem = ({ model }: { model: AiModel }) => {
  const { navigate } = useNavigation();
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;

  const handleNavToModelDetail = (link: string) => {
    navigate(`/models/${link}`);
  };

  return (
    <div
      onClick={() => handleNavToModelDetail(model.id)}
      className="group cursor-pointer items-stretch overflow-hidden rounded-xl bg-gradient-to-br from-[#141414] to-[#313131] p-3"
    >
      <img
        src={model.imgUrl || ""}
        alt={model.name}
        className="h-48 w-full rounded-lg object-cover"
      />
      <div className="mt-6 flex h-full w-full flex-col gap-2 p-1">
        <h1 className="shrink-0 truncate text-2xl font-bold">
          {currentLocale === LanguageLocale.English
            ? model.name
            : model.nameZh ?? model.name}
        </h1>
        <p className="h-12 text-sm text-muted-foreground/60">
          {currentLocale === LanguageLocale.English
            ? model.desc
            : model.descZh ?? model.desc}
        </p>
        <p className="flex h-12 items-end justify-between gap-1">
          <span className="text-sm text-muted-foreground/60">
            {model.runCount} {t("runs")}
          </span>
          <Button
            size={"sm"}
            className="mt-4 gap-2 rounded-lg bg-background text-foreground hover:bg-background/50 group-hover:flex sm:hidden"
          >
            <PlayIcon className="h-3 w-3" />
            {t("Run")}
          </Button>
        </p>
      </div>
    </div>
  );
};

export default ModelItem;

"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { AiModel } from "@prisma/client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Tab } from "./ModelDetailMainPage";
import {
  IconGitHub,
  LicenseIcon,
  PanIcon,
  PaperIcon,
} from "~/components/common/Icons";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "~/components/user/settings/LanguageSelector";
import useNavigation from "~/hooks/useNavigation";
import { api } from "~/trpc/react";
import { ModelProvider, ModelStatus } from "~/lib/enums";
import { cn } from "~/lib/utils";
import { useModelStatus } from "~/hooks/useStore";

interface ModelDetailTitleProps {
  model: AiModel;
  tab: Tab;
}

const IS_FEATURE_ENABLED = false;
const FETCH_MODEL_STATUS_INTERVAL = 20000;

const ModelDetailTitle = ({ model, tab }: ModelDetailTitleProps) => {
  const pathname = usePathname();
  const { navigate, replace } = useNavigation();
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;

  const { modelStatus, setModelStatus } = useModelStatus();

  useEffect(() => {
    setModelStatus(model.statusUrl ? null : ModelStatus.Online);
  }, [model.statusUrl, setModelStatus]);

  const { isLoading } = api.model.fetchStatus.useQuery(
    {
      provider: model.provider as ModelProvider,
      url: model.statusUrl ?? "",
    },
    {
      enabled: !!model.statusUrl,
      refetchInterval: FETCH_MODEL_STATUS_INTERVAL,
      onSuccess: (data) => {
        setModelStatus(data);
      },
    },
  );

  const loading = model.statusUrl ? isLoading : false;

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate("/models")}
                  className="cursor-pointer font-bold text-muted-foreground/90"
                >
                  {t("All Models")} <span className="ml-2">/</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage className="mr-4 text-2xl font-bold">
                  {currentLocale === LanguageLocale.English
                    ? model.name
                    : model.nameZh ?? model.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mr-4 hidden select-none items-center gap-2 rounded-lg bg-muted-foreground/10 px-2 py-2 sm:flex">
            <PanIcon
              className={
                loading
                  ? "text-muted-foreground/90"
                  : modelStatus === ModelStatus.Offline
                    ? "text-muted-foreground/90"
                    : "animate-spin-slow text-online"
              }
            />
            <span
              className={cn(
                "text-xs font-bold",
                loading
                  ? "text-muted-foreground/90"
                  : modelStatus === ModelStatus.Offline
                    ? "text-muted-foreground/90"
                    : "text-online",
              )}
            >
              {loading ? (
                <span>{t("Loading")}...</span>
              ) : (
                t(
                  modelStatus === ModelStatus.Online && model.runOn
                    ? `${t("Running on")} ${model.runOn}`
                    : "Offline",
                )
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {tab === Tab.PLAYGROUND && (
            <Button
              className="h-8 font-bold"
              size={"sm"}
              onClick={() => {
                replace(`${pathname}?tab=${Tab.API}`);
                sendGAEvent({
                  event: "apiIntegrationButtonClicked",
                  value: `${Date.now()}`,
                });
              }}
            >
              {t("API Integration")}
            </Button>
          )}
          {IS_FEATURE_ENABLED && model.github && (
            <a
              href={model.github}
              target="_blank"
              className="flex cursor-pointer items-center gap-1 text-sm underline"
            >
              <IconGitHub className="h-4 w-4" />
              Github
            </a>
          )}
          {IS_FEATURE_ENABLED && model.paper && (
            <a
              href={model.paper}
              target="_blank"
              className="flex cursor-pointer items-center gap-1 text-sm underline"
            >
              <PaperIcon className="h-4 w-4" />
              Paper
            </a>
          )}
          {IS_FEATURE_ENABLED && model.license && (
            <a
              href={model.license}
              target="_blank"
              className="flex cursor-pointer items-center gap-1 text-sm underline"
            >
              <LicenseIcon className="h-4 w-4" />
              License
            </a>
          )}

          {/* <div
            className="flex cursor-pointer gap-1"
            onClick={() => handleStarring(model.id as string)}
          >
            {renderStarIcon(model.id as string)}{" "}
            <span className="text-sm text-muted-foreground">
              {isModelStarred(model.id as string) ? "已" : ""}收藏
            </span>
          </div> */}
        </div>
      </div>
      <p className="mt-2 text-muted-foreground sm:max-w-[50vw]">
        {t(
          currentLocale === LanguageLocale.English
            ? model.desc
            : model.descZh ?? model.desc,
        )}
      </p>
    </div>
  );
};

export default ModelDetailTitle;

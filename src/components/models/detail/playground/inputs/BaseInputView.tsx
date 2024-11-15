"use client";

import { InputAssistTool, ModelParam } from "@prisma/client";
import * as React from "react";
import { InfoIcon, MagicIcon } from "~/components/common/Icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "~/components/user/settings/LanguageSelector";

export interface BaseInputViewProps {
  param: ModelParam;
  value: string | undefined;
  onChange: (value: string) => void;
}

const renderAssistTool = ({
  input,
  param,
  onChange,
}: {
  input: string;
  param: ModelParam;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const toolType = param.assistTool;
  const [isGenerating, setIsGenerating] = React.useState(false);

  const promptFineTuneMutation = api.tool.promptFineTune.useMutation();
  const handlePromptFineTune = async () => {
    setIsGenerating(true);
    const res = await promptFineTuneMutation.mutateAsync({
      prompt: input,
    });
    if (!res) {
      setIsGenerating(false);
      return;
    }

    onChange(res);
    setIsGenerating(false);
  };
  switch (toolType) {
    case InputAssistTool.PROMPT_FINE_TUNE:
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                disabled={isGenerating}
                onClick={handlePromptFineTune}
                className="flex cursor-pointer items-center rounded-full bg-gradient-to-br from-[#7F11A6] to-[#C319FF] px-3 py-1.5 text-xs font-bold"
              >
                <MagicIcon />
                {""}
                {isGenerating
                  ? `${t("Optimizing")}...`
                  : t("Use AI to optimize input")}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t(
                  "AI will automatically translate/optimize your input content",
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

const BaseInputView = ({
  param,
  children,
  value,
  onChange,
}: {
  param: ModelParam;
  value: string | undefined;
  children: React.ReactNode;
  onChange: (value: string) => void;
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const defaultValue = param.defaultValue as any;

  return (
    <div className="group space-y-2">
      <div className="flex items-end justify-between">
        <div className="items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{param.displayName}</span>
            {defaultValue && (
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 cursor-pointer text-muted-foreground/40" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <span className="text-sm">
                    {" "}
                    {t("Default value")}: {defaultValue}
                  </span>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {t(
              currentLocale === LanguageLocale.English
                ? param.desc
                : param.descZh ?? param.desc,
            )}
          </div>
        </div>
        <div>
          {renderAssistTool({
            input: value as string,
            param,
            onChange,
          })}
        </div>
      </div>
      {children}
    </div>
  );
};

export default BaseInputView;

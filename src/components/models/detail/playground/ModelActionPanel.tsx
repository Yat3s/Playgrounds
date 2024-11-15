"use client";

import { AiModel, ModelExample } from "@prisma/client";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { sendGAEvent } from "@next/third-parties/google";
import { useModelStatus } from "~/hooks/useStore";
import { ModelStatus } from "~/lib/enums";
import { LanguageLocale } from "~/components/user/settings/LanguageSelector";

interface ModelActionProps {
  model: AiModel;
  examples: ModelExample[];
  onExampleSelect: (example: ModelExample) => void;
  onRun: () => void;
}

const ModelActionPanel = ({
  model,
  onRun,
  examples,
  onExampleSelect,
}: ModelActionProps) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;
  const [activeExampleId, setActiveExampleId] = React.useState<string | null>(
    examples[0]?.id ?? null,
  );
  const { modelStatus } = useModelStatus();

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t bg-background py-4">
      <div className="flex flex-wrap items-center gap-2">
        {examples.length > 0 && (
          <div className="mr-2 text-sm text-muted-foreground">
            {t("Examples")}:
          </div>
        )}
        {examples.map((example, index) => (
          <div
            key={example.id}
            onClick={() => {
              setActiveExampleId(example.id);
              onExampleSelect(example);
              sendGAEvent({
                event: "modelExampleButtonClicked",
                value: example.id,
              });
            }}
            className={cn(
              "cursor-pointer bg-muted-foreground/20 px-3 py-1 text-sm font-bold",
              activeExampleId === example.id &&
                "bg-foreground/90 text-background",
            )}
          >
            {t("Example")} {String.fromCharCode(65 + index)}
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-xs text-muted-foreground">
          {currentLocale === LanguageLocale.English ? (
            <span className="text-base font-bold">-</span>
          ) : (
            "消耗 "
          )}
          <span className="font-bold text-foreground">{model.cost}</span>{" "}
          {t("Credits")}
        </div>
        <Button onClick={onRun} className="w-24 font-semibold">
          {t(modelStatus === ModelStatus.Online ? "Run" : "Boot + Run")}
        </Button>
      </div>
    </div>
  );
};

export default ModelActionPanel;

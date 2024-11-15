"use client";

import { AiModel } from "@prisma/client";
import { useTranslation } from "react-i18next";

const PredictingLoading = ({
  predictTime,
  model,
  isPredictTimeout,
}: {
  predictTime: number;
  model: AiModel;
  isPredictTimeout: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-[60vh] w-full flex-col items-center justify-center gap-2 bg-muted/50">
      <div className="loader" />

      <span className="mt-2 text-muted-foreground/70">
        {t("This might be the beginning of something big")}...
      </span>

      <div className="absolute right-4 top-4 flex flex-col items-end text-xs text-muted-foreground/50">
        <div>
          <span className="text-muted-foreground">
            {predictTime.toFixed(1)}
          </span>{" "}
          / {model.estRunTime.toFixed(1)} {t("seconds")}
        </div>
        {isPredictTimeout ? (
          <span>{t("Working even harder")}...</span>
        ) : (
          <span className="text-xs">{t("Historical average time")}</span>
        )}
      </div>
    </div>
  );
};

export default PredictingLoading;

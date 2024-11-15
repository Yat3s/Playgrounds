"use client";

import { AiModel, ModelExample, ModelParam } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import ApiCode from "~/components/models/detail/api/ApiCode";
import ApiOutput from "~/components/models/detail/api/ApiOutputSchema";
import ApiParamsTable from "./ApiParamsTable";
import useNavigation from "~/hooks/useNavigation";

const ApiLayout = ({
  model,
}: {
  model: AiModel & {
    params: ModelParam[];
    examples: ModelExample[];
  };
}) => {
  const { replace } = useNavigation();
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-6">
      <div
        onClick={() => {
          replace(`${pathname}`);
        }}
        className="flex w-fit cursor-pointer items-center gap-1 text-sm font-bold hover:text-muted-foreground/80"
      >
        <ChevronLeft />
        {t("Back to Playground")}
      </div>
      <div className="relative mb-6 xl:w-[60vw]">
        <ApiCode model={model} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="font-bold">{t("Input Parameters")}</div>
        <ApiParamsTable params={model.params} />
      </div>
      {model.outputSchema && <ApiOutput outputSchema={model.outputSchema} />}
    </section>
  );
};

export default ApiLayout;

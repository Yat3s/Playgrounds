"use client";

import { Prisma } from "@prisma/client";
import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ApiOutput = ({ outputSchema }: { outputSchema: Prisma.JsonValue }) => {
  const { t } = useTranslation();

  const handleCopyClick = () => {
    if (!outputSchema) {
      toast.error(t("Copy failed"));
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(outputSchema, null, 2));
    toast.success(t("Copied successfully"));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="font-bold">📘 {t("Output Schema")}</div>
      <div className="group relative w-full overflow-x-auto bg-muted p-6 text-sm xl:w-[60vw]">
        <pre>{JSON.stringify(outputSchema, null, 2)}</pre>
        <div
          onClick={handleCopyClick}
          className="absolute right-6 top-4 hidden cursor-pointer bg-background p-2 group-hover:flex"
        >
          <Copy className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ApiOutput;

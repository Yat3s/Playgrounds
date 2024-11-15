"use client";

import { AiModel, ModelExample, ModelParam } from "@prisma/client";
import * as React from "react";
import { toast } from "sonner";
import { ApiLangSelector } from "~/components/models/detail/api/ApiLangSelector";
import {
  ApiLangOption,
  PythonLang,
  createRequestConfig,
  generateApiCodeSnippet,
} from "~/lib/code";
import CodeHighlight from "./CodeHighlight";
import { useTranslation } from "react-i18next";

const ApiCode = ({
  model,
}: {
  model: AiModel & {
    params: ModelParam[];
    examples: ModelExample[];
  };
}) => {
  const { t } = useTranslation();
  const [language, setLanguage] = React.useState<ApiLangOption>(PythonLang);
  const [codeSnippet, setCodeSnippet] = React.useState<string>();
  const paramJson = model.examples[0]?.paramJson ?? {
    param1: "...",
    param2: "...",
  };
  const config = createRequestConfig(model.modelId, paramJson);

  React.useEffect(() => {
    setCodeSnippet(generateApiCodeSnippet(language, config));
  }, [language]);

  const handleCopy = () => {
    if (!codeSnippet) {
      toast.error(t("Failed to copy code"));
      return;
    }
    navigator.clipboard.writeText(codeSnippet);
    toast.success(t("Copied successfully"));
  };

  return (
    <div className="flex flex-col overflow-x-auto rounded-lg bg-[#151515] p-4 pt-6 text-sm">
      <header className="flex items-center justify-between px-2">
        <ApiLangSelector language={language} onSetLanguage={setLanguage} />
        <div
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-2"
        >
          <a className="text-xs text-muted-foreground">{t("Copy Code")}</a>
        </div>
      </header>
      <div className="mt-2">
        {codeSnippet && (
          <CodeHighlight language={language.hljsLang} code={codeSnippet} />
        )}
      </div>
    </div>
  );
};

export default ApiCode;

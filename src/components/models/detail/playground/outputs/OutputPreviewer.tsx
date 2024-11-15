"use client";

import FilePreviewer from "~/components/FilePreviewer";
import { OutputFormat } from "~/lib/enums";
import { useTranslation } from "react-i18next";

const OutputPreviewer = ({
  output,
  outputFormat,
}: {
  output: string[] | string;
  outputFormat: OutputFormat;
}) => {
  const { t } = useTranslation();

  const renderOutput = () => {
    switch (outputFormat) {
      case OutputFormat.Uri:
        return <FilePreviewer showDownload={true} urls={output} />;
      case OutputFormat.Text:
      case OutputFormat.ChunkedText:
        return <p className="text-muted-foreground">{output}</p>;
      default:
        return (
          <p className="text-muted-foreground">
            {t("Unsupported output format")} {outputFormat}
          </p>
        );
    }
  };

  return <div>{renderOutput()}</div>;
};

export default OutputPreviewer;

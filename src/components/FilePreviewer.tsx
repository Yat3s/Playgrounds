"use client";

import { sendGAEvent } from "@next/third-parties/google";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { DOWNLOAD_FILE_PREFIX, SUPPORTED_FILE_TYPES } from "~/lib/constants";
import { FileExtension } from "~/lib/enums";
import { Button } from "./ui/button";

interface FilePreviewerProps {
  urls: string | string[];
  showDownload?: boolean;
}

const FilePreviewer: React.FC<FilePreviewerProps> = ({
  urls,
  showDownload = false,
}) => {
  const { t } = useTranslation();

  const renderSingleFilePreview = (url: string) => {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const extension = pathname.split(".").pop()?.toLocaleLowerCase();

    switch (extension) {
      case FileExtension.Mp4:
        return <video src={url} controls muted />;
      case FileExtension.Pdf:
        return (
          <embed src={url} type="application/pdf" width="100%" height="600px" />
        );
      case FileExtension.Mp3:
      case FileExtension.Wav:
        return <audio src={url} controls />;
      case FileExtension.Png:
      case FileExtension.Jpg:
      case FileExtension.Jpeg:
      case FileExtension.Webp:
      case FileExtension.Gif:
        return <img src={url} alt="Preview" />;
      default:
        return <div>{t("Unsupported file type")}</div>;
    }
  };

  const handleDownload = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = DOWNLOAD_FILE_PREFIX;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderFilePreviews = (fileUrls: string[]) => {
    return fileUrls.map((url, index) => (
      <div key={index} className="group relative ">
        {showDownload && canDownload(url) && (
          <Button
            size={"sm"}
            className="absolute right-4 z-30 hidden group-hover:block"
            onClick={() => {
              handleDownload(url);
              sendGAEvent({ event: "downloadFileButtonClicked", value: url });
            }}
          >
            {t("Download original file")}
          </Button>
        )}
        {renderSingleFilePreview(url)}
      </div>
    ));
  };

  if (Array.isArray(urls)) {
    return <div>{renderFilePreviews(urls)}</div>;
  } else {
    return <div>{renderFilePreviews([urls])}</div>;
  }
};

export default FilePreviewer;

const canDownload = (url: string) => {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const extension = pathname.split(".").pop() as FileExtension;
  if (!extension) {
    return false;
  }

  return SUPPORTED_FILE_TYPES.includes(extension);
};

"use client";

import { BlockBlobClient } from "@azure/storage-blob";
import { useSession } from "next-auth/react";
import React from "react";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useModal } from "~/hooks/useStore";
import FilePreviewer from "~/components/FilePreviewer";
import { generateFileBlobName } from "~/lib/utils";
import { api } from "~/trpc/react";

interface FileUploadProps {
  url: string;
  onSetUrl: (url: string) => void;
}

const FileUpload = ({ url, onSetUrl }: FileUploadProps) => {
  const { data: session } = useSession();
  const { toggleAuthModal } = useModal();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = React.useState(false);

  const { mutateAsync: generateUploadUrl } =
    api.storage.generateUploadUrl.useMutation();

  const onDrop = async (acceptedFiles: any) => {
    if (!session) {
      toggleAuthModal(true);
      return;
    }

    if (acceptedFiles.length > 0) {
      setIsUploading(true);

      const file = acceptedFiles[0];
      const blobName = generateFileBlobName(file.name);

      try {
        const { url } = await generateUploadUrl({ blobName });
        const blobClient = new BlockBlobClient(url);
        await blobClient.uploadData(file);
        const cleanUrl = removeSASTokenFromUrl(url);

        onSetUrl(cleanUrl);
        setIsUploading(false);
      } catch (error: any) {
        toast.error("上传失败");
        setIsUploading(false);
        console.error("Upload File error", error);
      }
    }
  };

  const handleAuth = (e: any) => {
    if (!session) {
      e.stopPropagation();
      e.preventDefault();
      toggleAuthModal(true);
      return;
    }
  };

  return (
    <div onClick={(e) => handleAuth(e)} className="flex h-full flex-col gap-2">
      {url && <FilePreviewer urls={url}></FilePreviewer>}
      <Dropzone
        multiple={false}
        onDrop={onDrop}
        disabled={!session ? true : false}
      >
        {({ getRootProps, getInputProps }) => (
          <label
            {...getRootProps()}
            htmlFor="dropzone-file"
            className="hover:border-bg-foreground flex h-[12vh] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/50 bg-muted p-10 hover:border-primary"
          >
            <div className="text-muted-foreground">
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <span className="loader"></span>
                  {t("Uploading...")}
                </div>
              ) : (
                "点击或者拖拽文件到这里"
              )}
            </div>

            <input {...getInputProps()} className="hidden" />
          </label>
        )}
      </Dropzone>
    </div>
  );
};

function removeSASTokenFromUrl(url: string) {
  const urlParts = new URL(url);
  const baseUrl = `${urlParts.protocol}//${urlParts.hostname}${urlParts.pathname}`;

  return baseUrl;
}

export default FileUpload;

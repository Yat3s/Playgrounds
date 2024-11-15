"use client";

import { BlockBlobClient } from "@azure/storage-blob";
import { useSession } from "next-auth/react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useModal } from "~/hooks/useStore";
import FilePreviewer from "~/components/FilePreviewer";
import { Input } from "~/components/ui/input";
import { generateFileBlobName } from "~/lib/utils";
import { api } from "~/trpc/react";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";

const FileInput = ({ param, value, onChange }: BaseInputViewProps) => {
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

        onChange(url);
        setIsUploading(false);
      } catch (error: any) {
        toast.error(t("Upload failed"));
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

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: onDrop,
    multiple: false,
    disabled: !session ? true : false,
  });

  return (
    <div onClick={(e) => handleAuth(e)} className="flex h-full flex-col gap-2">
      <BaseInputView param={param} value={value} onChange={onChange}>
        {value && <FilePreviewer urls={value} />}
        <div
          {...getRootProps()}
          className="hover:border-bg-foreground flex h-[12vh] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted/80 bg-muted/30 p-10 hover:border-muted-foreground/50"
        >
          <p className="text-muted-foreground">
            {isUploading ? (
              <div className="flex items-center gap-2">
                <span className="loader" />
                {t("Uploading...")}
              </div>
            ) : (
              t("Click or drag a file here")
            )}
          </p>
          <Input {...getInputProps()} className="hidden" />
        </div>
      </BaseInputView>
    </div>
  );
};

export default FileInput;

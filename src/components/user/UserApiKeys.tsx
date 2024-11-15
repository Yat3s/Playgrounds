"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CopyApiKeyIcon, DeleteIcon } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { sendGAEvent } from "@next/third-parties/google";

const THROTTLE_LIMIT = 1000;

const UserApiKeys = () => {
  const { t } = useTranslation();
  const [apiKeyName, setApiKeyName] = React.useState<string>();
  const [apiKeyPreview, setApiKeyPreview] = React.useState<string>();
  const apiKeyPreviewRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // When the apiKeyPreview is updated and Dialog opens, select all text
    if (apiKeyPreviewRef.current && apiKeyPreview) {
      apiKeyPreviewRef.current.focus();
      apiKeyPreviewRef.current.select();
    }
  }, [apiKeyPreview]);

  const { data, refetch } = api.user.fetchUserApiKeys.useQuery();
  const { mutateAsync: createApiKey } = api.user.createApiKey.useMutation({
    onSuccess(data) {
      toast.success(t("Created successfully"));
      setApiKeyPreview(data.apiKey);
      refetch();
    },
    onError(error) {
      toast.error(t("API Key already exist"));
    },
  });
  const { mutateAsync: deleteApiKey } = api.user.deleteApiKey.useMutation();

  const throttle = <T extends any[]>(
    func: (...args: T) => void,
    limit: number,
  ) => {
    let inThrottle: boolean;
    return function (this: ThisParameterType<typeof func>, ...args: T) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const handleCreateApiKey = async () => {
    sendGAEvent({ event: "createApiKey", value: `${Date.now()}` });
    if (!apiKeyName) {
      toast.error(t("Please enter API Key name"));
      return;
    }

    await createApiKey({ name: apiKeyName });
  };

  const handleCreateApiKeyThrottled = throttle(
    handleCreateApiKey,
    THROTTLE_LIMIT,
  );

  const handleDeleteApiKey = async (apiKeyId: string) => {
    await deleteApiKey(
      { apiKeyId },
      {
        onSuccess: () => {
          toast.success(t("Deleted successfully"));
          refetch();
        },
        onError: () => {
          toast.success(t("Deletion failed"));
        },
      },
    );
  };

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast.success(t("Copied to clipboard"));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-6 text-lg font-extrabold sm:text-2xl">
        {t("API Keys")}
      </h1>
      <div className="flex flex-col gap-2">
        <Input
          placeholder={t("API Key Name")}
          className="mb-2 self-start placeholder:font-bold placeholder:text-muted-foreground/50"
          value={apiKeyName}
          onChange={(e) => setApiKeyName(e.target.value)}
        />
        <Button
          onClick={handleCreateApiKeyThrottled}
          className="w-full font-semibold"
        >
          {t("Create API Key")}
        </Button>
        <div className="mt-10 w-4/5">
          <p className="mb-2 text-xs text-muted-foreground sm:text-sm">
            {t(
              "Below are your API keys. Please note that once you generate an API key, it will not be displayed again. Do not share your API keys with others or expose them in browser or client-side code.",
            )}
          </p>
        </div>
      </div>

      {data?.map((item) => (
        <div key={item.id} className="flex w-4/5 flex-col">
          <h2 className="font-bold">{item.name}</h2>
          <div className="flex cursor-pointer flex-col items-center gap-2 sm:flex-row">
            <span className="mr-2 self-start break-all text-xs text-muted-foreground md:text-sm">
              {item.displayKey}
            </span>
            <div
              className="self-start"
              onClick={() => handleDeleteApiKey(item.id)}
            >
              <DeleteIcon />
            </div>
          </div>
        </div>
      ))}

      {apiKeyPreview && (
        <Dialog
          open={apiKeyPreview.length > 0}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setApiKeyPreview("");
            }
          }}
        >
          <DialogContent className="flex w-screen flex-col !rounded-3xl px-4 md:p-8 lg:max-w-[60vw] xl:max-w-[50vw] 2xl:max-w-[40vw]">
            <div className="font-bold">{t("Save your API Key")}</div>
            <p className="text-sm text-muted-foreground">
              {t(
                "Please save this key in a secure and easily accessible place. For security reasons, you will not be able to view your API key again through your X Model account. If you lose this key, you will need to generate a new one.",
              )}
            </p>
            <div className="flex w-full items-center gap-4">
              <input
                ref={apiKeyPreviewRef}
                value={apiKeyPreview}
                readOnly
                className="w-full rounded-2xl border p-2 text-sm focus-visible:outline-none lg:px-4 lg:text-base"
                onFocus={(event) => event.target.select()}
              />
              <Button
                onClick={() => handleCopyApiKey(apiKeyPreview)}
                className="hidden items-center gap-1 lg:flex"
              >
                <CopyApiKeyIcon />
                {t("Copy")}
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 self-end">
              <Button
                onClick={() => handleCopyApiKey(apiKeyPreview)}
                className="flex items-center gap-1 lg:hidden"
              >
                <CopyApiKeyIcon />
                {t("Copy")}
              </Button>
              <Button
                onClick={() => setApiKeyPreview("")}
                className="w-[5rem] self-end rounded-lg bg-muted-foreground/35 text-sm text-foreground hover:bg-muted-foreground/35"
              >
                {t("Done")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserApiKeys;

"use client";

import { useEffect, useState } from "react";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import CmsLayout from "../cms-layout";

const ModelProviderPage = () => {
  const { data: modelProviders } = api.cms.fetchAllModelProviders.useQuery();
  const updateModelProvider = api.cms.updateModelProvider.useMutation();

  const [localModelProviders, setLocalModelProviders] =
    useState<typeof modelProviders>();

  useEffect(() => {
    setLocalModelProviders(modelProviders);
  }, [modelProviders]);

  const handleModelProviderSave = (providerId: string) => {
    updateModelProvider.mutate({
      modelProviderId: providerId,
      apiKeys:
        localModelProviders?.find((provider) => provider.id === providerId)
          ?.apiKeys ?? [],
    });
  };

  const handleApiKeyChange = (
    providerId: string,
    apiKey: string,
    inputIndex: number,
  ) => {
    const updatedModelProviders = localModelProviders?.map((provider) => {
      if (provider.id === providerId) {
        return {
          ...provider,
          apiKeys: provider.apiKeys.map((key, index) => {
            if (index === inputIndex) {
              return apiKey;
            }
            return key;
          }),
        };
      }
      return provider;
    });
    setLocalModelProviders(updatedModelProviders);
  };

  const handleNewApiKey = (providerId: string) => {
    const updatedModelProviders = localModelProviders?.map((provider) => {
      if (provider.id === providerId) {
        return {
          ...provider,
          apiKeys: [...provider.apiKeys, ""],
        };
      }
      return provider;
    });
    setLocalModelProviders(updatedModelProviders);
  };

  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.MODEL_PROVIDER} superAdmin={true}>
      <div className="text-3xl font-bold">模型提供商</div>
      <div className="mt-8 space-y-8">
        {localModelProviders?.map((modelProvider) => (
          <div>
            <div className="text-lg font-bold" key={modelProvider.id}>
              {modelProvider.name}
            </div>
            <div className="mt-2 space-y-2">
              <div className="text-muted-foreground">API Keys</div>
              {modelProvider.apiKeys.map((apiKey, index) => (
                <Input
                  key={apiKey}
                  value={apiKey}
                  className="w-[30%]"
                  onChange={(e) =>
                    handleApiKeyChange(modelProvider.id, e.target.value, index)
                  }
                ></Input>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                size={"sm"}
                onClick={() => {
                  handleNewApiKey(modelProvider.id);
                }}
              >
                添加 API Key
              </Button>

              <Button
                size={"sm"}
                onClick={() => {
                  handleModelProviderSave(modelProvider.id);
                }}
              >
                保存
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CmsLayout>
  );
};

export default ModelProviderPage;

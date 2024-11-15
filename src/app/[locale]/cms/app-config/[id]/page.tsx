"use client";

import React, { useEffect } from "react";
import { AppConfig } from "@prisma/client";
import { api } from "~/trpc/react";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import AppConfigEditor from "~/components/cms/editors/AppConfigEditor";
import CmsLayout from "../../cms-layout";
import { newModelPath } from "~/components/cms/AiModelManagement";

export default function cmsAppConfigPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: appConfigData, isLoading } =
    params.id && params.id != newModelPath
      ? api.cmsAppConfig.fetchById.useQuery({ id: params.id })
      : { data: {}, isLoading: false };

  const { mutateAsync: createAppConfig } =
    api.cmsAppConfig.create.useMutation();
  const { mutateAsync: updateAppConfig } =
    api.cmsAppConfig.update.useMutation();

  const [editingAppConfig, setEditingAppConfig] = React.useState<
    AppConfig | undefined
  >(undefined);

  useEffect(() => {
    if (
      params.id &&
      !isLoading &&
      appConfigData &&
      params.id === appConfigData.id
    ) {
      setEditingAppConfig(appConfigData as AppConfig);
    }
  }, [appConfigData, isLoading, params]);

  return (
    <>
      <CmsLayout sideBarKey={MENU_ITEM_KEYS.APP_CONFIG}>
        <AppConfigEditor
          appConfig={editingAppConfig}
          onAppConfigCreated={createAppConfig}
          onAppConfigUpdated={updateAppConfig}
        />
      </CmsLayout>
    </>
  );
}

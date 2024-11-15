"use client";

import React, { useEffect } from "react";
import { ModelCategory } from "@prisma/client";
import { api } from "~/trpc/react";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import ModelCategoryEditor from "~/components/cms/editors/ModelCategoryEditor";
import CmsLayout from "../../cms-layout";
import { newModelPath } from "~/components/cms/AiModelManagement";

export default function ModelPage({ params }: { params: { id: string } }) {
  const { data: modelsCategoryData, isLoading } =
    params.id && params.id != newModelPath
      ? api.cmsModelCategory.fetchById.useQuery({ id: params.id })
      : { data: {}, isLoading: false };

  const { mutateAsync: createModelCategory } =
    api.cmsModelCategory.create.useMutation();
  const { mutateAsync: updateModelCategory } =
    api.cmsModelCategory.update.useMutation();

  const [editingModelCategory, setEditingModelCategory] = React.useState<
    ModelCategory | undefined
  >(undefined);

  useEffect(() => {
    if (
      params.id &&
      !isLoading &&
      modelsCategoryData &&
      params.id === modelsCategoryData.id
    ) {
      setEditingModelCategory(modelsCategoryData as ModelCategory);
    }
  }, [modelsCategoryData, isLoading, params]);

  return (
    <>
      <CmsLayout sideBarKey={MENU_ITEM_KEYS.MODEL_CATEGORY}>
        <ModelCategoryEditor
          modelCategory={editingModelCategory}
          onModelCategoryCreated={createModelCategory}
          onModelCategoryUpdated={updateModelCategory}
        />
      </CmsLayout>
    </>
  );
}

"use client";

import { api } from "~/trpc/react";
import { AiModel, ModelCategory } from "@prisma/client";
import AiModelEditor from "~/components/cms/editors/AiModelEditor";
import * as React from "react";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import CmsLayout from "../../cms-layout";
import { newCategoryPath } from "~/components/cms/ModelCategoryManagement";

export default function ModelPage({ params }: { params: { id: string } }) {
  const { data: modelsData, isLoading } =
    params.id && params.id != newCategoryPath
      ? api.cmsModel.fetchById.useQuery({ id: params.id })
      : { data: {}, isLoading: false };

  type AiModelWithCategory = AiModel & {
    categories: ModelCategory[];
  };

  const [editingModel, setEditingModel] = React.useState<
    AiModelWithCategory | undefined
  >(undefined);

  React.useEffect(() => {
    if (params.id && !isLoading && modelsData && params.id === modelsData.id) {
      setEditingModel(modelsData as AiModelWithCategory);
    }
  }, [modelsData, isLoading, params]);

  return (
    <>
      <CmsLayout sideBarKey={MENU_ITEM_KEYS.MODEL_INFO}>
        <AiModelEditor model={editingModel} />
      </CmsLayout>
    </>
  );
}

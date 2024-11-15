"use client";
import CmsLayout from "../cms-layout";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import AiModelManagement from "~/components/cms/AiModelManagement";

const ModelPage = () => {
  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.MODEL_INFO}>
      <AiModelManagement />
    </CmsLayout>
  );
};
export default ModelPage;

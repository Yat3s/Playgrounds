"use client";

import ModelCategoryManagement from "~/components/cms/ModelCategoryManagement";
import CmsLayout from "../cms-layout";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";

const CategoryPage = () => {
  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.MODEL_CATEGORY}>
      <ModelCategoryManagement />
    </CmsLayout>
  );
};
export default CategoryPage;

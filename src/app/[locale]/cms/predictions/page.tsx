"use client";

import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import CmsLayout from "../cms-layout";
import PredictionManagement from "~/components/cms/PredictionManagement";

const PredictionPage = () => {
  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.PREDICTION}>
      <PredictionManagement />
    </CmsLayout>
  );
};

export default PredictionPage;

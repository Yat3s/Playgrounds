"use client";

import * as React from "react";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import CmsLayout from "../cms-layout";
import AppConfigManagement from "~/components/cms/AppConfigManagement";

const appConfigPage = () => {
  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.APP_CONFIG}>
      <AppConfigManagement />
    </CmsLayout>
  );
};

export default appConfigPage;

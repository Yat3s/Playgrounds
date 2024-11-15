"use client";

import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";
import CmsLayout from "./cms-layout";

const CmsPage = () => {
  return (
    <>
      <CmsLayout sideBarKey={MENU_ITEM_KEYS.USER_INFO}>
        <title>X Model - CMS</title>
      </CmsLayout>
    </>
  );
};

export default CmsPage;

"use client";

import UserManagement from "~/components/cms/UserManagement";
import CmsLayout from "../cms-layout";
import { MENU_ITEM_KEYS } from "~/components/cms/CmsSidebar";

const UserPage = () => {
  return (
    <CmsLayout sideBarKey={MENU_ITEM_KEYS.USER_INFO}>
      <UserManagement />
    </CmsLayout>
  );
};
export default UserPage;

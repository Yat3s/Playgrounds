"use client";

import SidebarWrapper from "~/components/siderbar/SidebarWrapper";
import ContentLayout from "../content";
import { useTranslation } from "react-i18next";

const AppsPage = () => {
  const { t } = useTranslation();

  return (
    <SidebarWrapper>
      <ContentLayout>
        <div className="text-3xl font-bold">{t("Apps")}</div>
        <div className="mt-8 flex h-full w-full flex-col items-center justify-center rounded-lg bg-muted-foreground/10 p-4">
          <span className="font-bold text-muted-foreground/50">
            {t("In Development (New Folder.jpg)")}
          </span>
        </div>
      </ContentLayout>
    </SidebarWrapper>
  );
};

export default AppsPage;

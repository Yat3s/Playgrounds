"use client";

import { useParams } from "next/navigation";
import ContentLayout from "~/app/[locale]/content";
import ModelDetailMainPage from "~/components/models/detail/ModelDetailMainPage";
import SidebarWrapper from "~/components/siderbar/SidebarWrapper";

const ModelDetailPage = () => {
  const { id } = useParams();

  return (
    <SidebarWrapper>
      <ContentLayout>
        <ModelDetailMainPage modelId={id as string} />
      </ContentLayout>
    </SidebarWrapper>
  );
};

export default ModelDetailPage;

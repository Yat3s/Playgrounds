import ModelMainPage from "~/components/models/ModelPage";
import SidebarWrapper from "~/components/siderbar/SidebarWrapper";
import ContentLayout from "../content";

const ModelPage = () => {
  return (
    <SidebarWrapper>
      <ContentLayout>
        <ModelMainPage />
      </ContentLayout>
    </SidebarWrapper>
  );
};

export default ModelPage;

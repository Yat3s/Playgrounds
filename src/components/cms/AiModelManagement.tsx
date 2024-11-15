"use client";

import {
  AiModel,
  ModelCategory,
  ModelExample,
  ModelParam,
} from "@prisma/client";
import { message, ConfigProvider, theme } from "antd";
import * as React from "react";
import { api } from "~/trpc/react";
import AlertModal from "../modals/AlertModal";
import ImportDataDialog from "./sections/ImportModelDataDialog";
import TableModal from "./TableModal";
import ExampleTable from "./editors/ExampleTable";
import ParamTable from "./editors/ParamTable";
import AiModelTable from "./AiModelTable";
import useNavigation from "~/hooks/useNavigation";

export const newModelPath = "new";

export type AiModelWithRelations = AiModel & {
  categories: ModelCategory[];
  params: ModelParam[];
  examples: ModelExample[];
};

export type TableDataType = {
  data: AiModelWithRelations[];
  total: number;
  pageSize: number;
  current: number;
};

export type filterType = {
  current?: number;
  pageSize?: number;
  name?: string;
  modelId?: string;
  desc?: string;
  descZh?: string;
  cost?: number;
  runCount?: number;
  estRunTime?: number;
  runOn?: string;
  author?: string;
  github?: string;
  paper?: string;
  license?: string;
  outputFormat?: string;
  supportStream?: boolean;
  provider?: string;
  providerModelName?: string;
};

const defaultPageConfig = {
  current: 1,
  pageSize: 50,
};

export default function AiModelManagementPage() {
  const { navigate } = useNavigation();
  const [searchParams, setSearchParams] =
    React.useState<filterType>(defaultPageConfig);
  const {
    data: modelsData,
    isLoading,
    refetch,
  } = api.cmsModel.fetchAll.useQuery(searchParams);
  const { mutateAsync: deleteModel } = api.cmsModel.delete.useMutation();
  const { mutateAsync: deleteModelExample } =
    api.cmsModelExample.delete.useMutation();
  const { mutateAsync: updateModelExample } =
    api.cmsModelExample.update.useMutation();
  const { mutateAsync: addDefaultModelParam } =
    api.cmsModelParam.addDefaultParam.useMutation();
  const { mutateAsync: deleteModelParam } =
    api.cmsModelParam.delete.useMutation();
  const { mutateAsync: updateModelParam } =
    api.cmsModelParam.update.useMutation();

  const [models, setModels] = React.useState<TableDataType>();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [currentModelId, setCurrentModelId] = React.useState<string | null>(
    null,
  );
  const [openImportDataDialog, setOpenImportDataDialog] = React.useState({
    open: false,
    modelId: "",
    type: "" as "param" | "example",
  });
  const [currentModel, setCurrentModel] = React.useState<AiModel>();
  const [currentExample, setCurrentExample] = React.useState<ModelExample[]>();
  const [currentParam, setCurrentParam] = React.useState<ModelParam[]>();
  const [openModelExampleDialog, setOpenModelExampleDialog] =
    React.useState(false);
  const [openModelParamDialog, setOpenModelParamDialog] = React.useState(false);
  const [currentEditExampleIds, setCurrentEditExampleIds] = React.useState<
    string[]
  >([]);
  const [currentEditParamsIds, setCurrentEditParamsIds] = React.useState<
    string[]
  >([]);

  React.useEffect(() => {
    if (!isLoading && modelsData) {
      setModels(modelsData);
    }
  }, [modelsData, isLoading]);

  const showDeleteModal = (aIModelId: string) => {
    setCurrentModelId(aIModelId);
    setDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddModel = () => {
    navigate(`/cms/models/${newModelPath}`);
  };

  const handleEditModel = (model: AiModel) => {
    navigate(`/cms/models/${model.id}`);
  };

  const handleDeleteModel = async (aIModelId: string) => {
    try {
      await deleteModel({ aIModelId });
      message.success("模型删除成功");
      if (models) {
        setModels({
          ...models,
          data: models.data.filter((model) => model.id !== aIModelId),
        });
      }
    } catch (error) {
      message.error("模型删除失败");
      console.error(error);
    }
  };

  const handleEditModelExample = async (
    exampleId: string,
    inputJson?: string,
    outputJson?: string,
  ) => {
    if (inputJson === undefined || outputJson === undefined) {
      message.error("输入输出不能为空");
      return;
    }
    try {
      const updateExample = await updateModelExample({
        exampleId,
        inputJson,
        outputJson,
      });
      updateExample.paramJson = JSON.stringify(
        updateExample.paramJson,
        null,
        2,
      );
      setCurrentExample(
        currentExample?.map((example) =>
          example.id === exampleId ? updateExample : example,
        ),
      );
      setCurrentEditExampleIds(
        currentEditExampleIds.filter((id) => id !== exampleId),
      );
      message.success("模型示例更新成功");
      refetch();
    } catch (error) {
      message.error("模型示例更新失败");
      console.error(error);
    }
  };

  const handleAddDefaultModelParam = async (modelId: string) => {
    const maxOrder = (currentParam ?? []).reduce((max, item) => {
      const order = item.order ?? -1;
      return order > max ? order : max;
    }, -1);
    const defaultParam = {
      order: maxOrder + 1,
      type: "",
      name: "",
      desc: "",
      required: false,
    };

    try {
      const addDefaultParam = await addDefaultModelParam({
        modelId,
        json: JSON.stringify(defaultParam),
      });
      if (addDefaultParam?.success) {
        if (addDefaultParam?.data) {
          setCurrentParam([...(currentParam || []), addDefaultParam.data]);
          refetch();
        }
      }
    } catch (error) {
      message.error("模型参数添加失败");
      console.error(error);
    }
  };

  const handleEditModelParam = async (
    paramId: string,
    updateParamData: ModelParam,
  ) => {
    try {
      const updateParam = await updateModelParam({
        paramId,
        json: JSON.stringify(updateParamData),
      });
      setCurrentParam(
        currentParam?.map((param) =>
          param.id === paramId ? updateParam : param,
        ),
      );
      setCurrentEditParamsIds(
        currentEditParamsIds.filter((id) => id !== paramId),
      );
      message.success("模型参数更新成功");
      refetch();
    } catch (error) {
      message.error("模型参数更新失败");
      console.error(error);
    }
  };

  const handleDeleteModelExample = async (exampleId: string) => {
    try {
      await deleteModelExample({ exampleId });
      message.success("模型示例删除成功");
      if (currentExample) {
        setCurrentExample(
          currentExample.filter((example) => example.id !== exampleId),
        );
        refetch();
      }
    } catch (error) {
      message.error("模型示例删除失败");
      console.error(error);
    }
  };

  const handleDeleteModelParam = async (paramId: string) => {
    try {
      await deleteModelParam({ paramId });
      message.success("模型参数删除成功");
      if (currentParam) {
        setCurrentParam(currentParam.filter((param) => param.id !== paramId));
        refetch();
      }
    } catch (error) {
      message.error("模型参数删除失败");
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!isLoading && modelsData) {
      modelsData.data.forEach((model) => {
        model.examples.forEach((example) => {
          // show the json in a more readable format when editing
          example.paramJson = JSON.stringify(example.paramJson, null, 2);
        });
      });
      setModels(modelsData);
    }
  }, [modelsData, isLoading]);

  React.useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  React.useEffect(() => {
    if (!openModelParamDialog) {
      setCurrentEditParamsIds([]);
    }
  }, [openModelParamDialog]);

  React.useEffect(() => {
    if (!openModelExampleDialog) {
      setCurrentEditExampleIds([]);
    }
  }, [openModelExampleDialog]);

  const themeConfig = {
    algorithm: [theme.darkAlgorithm],
  };

  return (
    <>
      <ConfigProvider theme={themeConfig}>
        <AlertModal
          deleteModalOpen={deleteModalOpen}
          onDeleteModalOpen={setDeleteModalOpen}
          onDeleteItem={handleDeleteModel}
          itemId={currentModelId}
        />
        <AiModelTable
          models={models}
          isLoading={isLoading}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          handleAddModel={handleAddModel}
          handleEditModel={handleEditModel}
          showDeleteModal={showDeleteModal}
          setOpenModelParamDialog={setOpenModelParamDialog}
          setCurrentModel={setCurrentModel}
          setCurrentParam={setCurrentParam}
          setOpenModelExampleDialog={setOpenModelExampleDialog}
          setCurrentExample={setCurrentExample}
        />
        <TableModal
          title="示例管理"
          modalOpen={openModelExampleDialog}
          changeModalOpen={setOpenModelExampleDialog}
        >
          <ExampleTable
            currentModel={currentModel}
            currentExample={currentExample}
            currentEditExampleIds={currentEditExampleIds}
            setCurrentEditExampleIds={setCurrentEditExampleIds}
            handleDeleteModelExample={handleDeleteModelExample}
            handleEditModelExample={handleEditModelExample}
            setOpenImportDataDialog={setOpenImportDataDialog}
          />
        </TableModal>
        <TableModal
          title="参数管理"
          modalOpen={openModelParamDialog}
          changeModalOpen={setOpenModelParamDialog}
        >
          <ParamTable
            currentModel={currentModel}
            currentParam={currentParam}
            currentEditParamsIds={currentEditParamsIds}
            setCurrentEditParamsIds={setCurrentEditParamsIds}
            handleAddDefaultModelParam={handleAddDefaultModelParam}
            handleDeleteModelParam={handleDeleteModelParam}
            handleEditModelParam={handleEditModelParam}
            setOpenImportDataDialog={setOpenImportDataDialog}
          />
        </TableModal>

        <ImportDataDialog
          type={openImportDataDialog.type}
          modelId={openImportDataDialog.modelId}
          handleRefresh={handleRefresh}
          currentModelExample={currentExample}
          setCurrentModelExample={setCurrentExample}
          setOpenModelParamDialog={setOpenModelParamDialog}
          open={openImportDataDialog.open}
          onOpenChange={(open) => {
            setOpenImportDataDialog({
              ...openImportDataDialog,
              open,
            });
          }}
        />
      </ConfigProvider>
    </>
  );
}

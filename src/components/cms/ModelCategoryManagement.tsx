import {
  ProColumns,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import { ModelCategory } from "@prisma/client";
import { Button, ConfigProvider, Space, message, theme } from "antd";
import * as React from "react";
import { api } from "~/trpc/react";
import useNavigation from "~/hooks/useNavigation";
import AlertModal from "../modals/AlertModal";

export const newCategoryPath = "new";

type TableDataType = {
  data: ModelCategory[];
  total: number;
  pageSize: number;
  current: number;
};

type filterType = {
  current?: number;
  pageSize?: number;
  name?: string;
  nameZh?: string;
  order?: number;
};

const defaultPageConfig = {
  current: 1,
  pageSize: 50,
};

export default function ModelCategoryManagementPage() {
  const { navigate } = useNavigation();
  const [searchParams, setSearchParams] =
    React.useState<filterType>(defaultPageConfig);
  const {
    data: modelsCategoryData,
    isLoading,
    refetch,
  } = api.cmsModelCategory.fetchAll.useQuery(searchParams);
  const { mutateAsync: deleteModelCategory } =
    api.cmsModelCategory.delete.useMutation();

  const [modelCategories, setModelCategories] = React.useState<TableDataType>();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [currentModelId, setCurrentModelId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!isLoading && modelsCategoryData) {
      setModelCategories(modelsCategoryData);
    }
  }, [modelsCategoryData, isLoading]);

  const columns: ProColumns<ModelCategory>[] = [
    {
      title: "英文名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "中文名称",
      dataIndex: "nameZh",
      key: "nameZh",
    },
    {
      title: "序号",
      dataIndex: "order",
      key: "order",
      valueType: "digit",
      sorter: (a, b) => {
        const orderA = a.order !== null ? a.order : 0;
        const orderB = b.order !== null ? b.order : 0;
        return orderA - orderB;
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
      render: (text) => {
        return text ? (
          <img src={text as string} alt="icon" style={{ width: "50px" }} />
        ) : null;
      },
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      width: "25%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditModelCategory(record)}
            className="bg-background text-foreground"
          >
            编辑
          </Button>
          <TableDropdown
            key="actionGroup"
            onSelect={(key) => {
              if (key === "delete") {
                showDeleteModal(record.id);
              }
            }}
            menus={[{ key: "delete", name: "删除" }]}
          />
        </Space>
      ),
    },
  ];

  const showDeleteModal = (modelCategoryId: string) => {
    setCurrentModelId(modelCategoryId);
    setDeleteModalOpen(true);
  };

  const handleAddModel = () => {
    navigate(`/cms/categories/${newCategoryPath}`);
  };

  const handleEditModelCategory = (model: ModelCategory) => {
    navigate(`/cms/categories/${model.id}`);
  };

  const handleDeleteModel = async (modelCategoryId: string) => {
    try {
      await deleteModelCategory({ modelCategoryId });
      message.success("模型分类删除成功");
      if (modelCategories) {
        setModelCategories({
          ...modelCategories,
          data: modelCategories?.data.filter(
            (category) => category.id !== modelCategoryId,
          ),
        });
      }
    } catch (error) {
      message.error("模型分类删除失败");
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!isLoading && modelsCategoryData) {
      setModelCategories(modelsCategoryData);
    }
  }, [modelsCategoryData, isLoading]);

  React.useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

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
        <ProTable
          loading={isLoading}
          headerTitle="模型分类管理"
          columns={columns}
          dataSource={modelCategories?.data}
          pagination={{
            pageSize: modelCategories?.pageSize,
            total: modelCategories?.total,
            current: modelCategories?.current,
            onChange: (page, pageSize) => {
              setSearchParams({
                ...searchParams,
                current: page,
                pageSize,
              });
            },
          }}
          search={{
            optionRender: ({ searchText, resetText }, { form }) => [
              <Button
                key="resetText"
                onClick={() => {
                  form?.resetFields();
                  setSearchParams(defaultPageConfig);
                }}
              >
                {resetText}
              </Button>,
              <Button
                key="searchText"
                type="primary"
                className="text-backgroun bg-blue-600"
                onClick={() => {
                  form?.submit();
                }}
              >
                {searchText}
              </Button>,
            ],
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={handleAddModel}
              className="bg-background text-foreground"
            >
              新增模型分类
            </Button>,
          ]}
          onReset={() => {
            setSearchParams(defaultPageConfig);
          }}
          onSubmit={(params) => {
            if (typeof params.order === "string") {
              params.order = parseInt(params.order);
            }
            setSearchParams(params);
          }}
        />
      </ConfigProvider>
    </>
  );
}

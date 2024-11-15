"use client";

import {
  ProColumns,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import { AppConfig } from "@prisma/client";
import { Button, ConfigProvider, Space, message, theme } from "antd";
import { useRouter } from "next/navigation";
import * as React from "react";
import { api } from "~/trpc/react";
import useNavigation from "~/hooks/useNavigation";
import AlertModal from "../modals/AlertModal";

export const newAppConfigPath = "new";

type TableDataType = {
  data: AppConfig[];
  total: number;
  pageSize: number;
  current: number;
};

type filterType = {
  current?: number;
  pageSize?: number;
  key?: string;
  value?: string;
};

const defaultPageConfig = {
  current: 1,
  pageSize: 20,
};

export default function AppConfigManagement() {
  const { navigate } = useNavigation();
  const [searchParams, setSearchParams] =
    React.useState<filterType>(defaultPageConfig);
  const {
    data: appConfigData,
    isLoading,
    refetch,
  } = api.cmsAppConfig.fetchAll.useQuery(searchParams);
  const { mutateAsync: deleteAppConfig } =
    api.cmsAppConfig.delete.useMutation();

  const [appConfig, setAppConfig] = React.useState<TableDataType>();
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [currentModelId, setCurrentModelId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!isLoading && appConfigData) {
      setAppConfig(appConfigData);
    }
  }, [appConfigData, isLoading]);

  const columns: ProColumns<AppConfig>[] = [
    {
      title: "配置名称",
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: 200,
    },
    {
      title: "配置值",
      dataIndex: "value",
      key: "value",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditAppConfig(record)}
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

  const showDeleteModal = (appConfigId: string) => {
    setCurrentModelId(appConfigId);
    setDeleteModalOpen(true);
  };

  const handleAddAppConfig = () => {
    navigate(`/cms/app-config/${newAppConfigPath}`);
  };

  const handleEditAppConfig = (appConfig: AppConfig) => {
    navigate(`/cms/app-config/${appConfig.id}`);
  };

  const handleDeleteModel = async (appConfigId: string) => {
    try {
      await deleteAppConfig({ appConfigId });
      message.success("应用配置删除成功");
      if (appConfig) {
        setAppConfig({
          ...appConfig,
          data: appConfig?.data.filter(
            (category) => category.id !== appConfigId,
          ),
        });
      }
    } catch (error) {
      message.error("应用配置删除失败");
      console.error(error);
    }
  };

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
          headerTitle="应用配置管理"
          columns={columns}
          dataSource={appConfig?.data}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: appConfig?.pageSize,
            total: appConfig?.total,
            current: appConfig?.current,
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
                className="bg-blue-600"
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
              onClick={handleAddAppConfig}
              className="bg-background text-foreground"
            >
              新增应用配置
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

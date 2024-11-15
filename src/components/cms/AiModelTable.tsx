"use client";

import {
  ProColumns,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import { AiModel, ModelExample, ModelParam } from "@prisma/client";
import { Button, Space } from "antd";
import { modelProviders } from "~/lib/ai-model";
import { TableDataType, filterType } from "./AiModelManagement";
import { defaultPageConfig } from "./UserManagement";

export default function AiModelTable({
  models,
  isLoading,
  searchParams,
  setSearchParams,
  handleAddModel,
  handleEditModel,
  showDeleteModal,
  setOpenModelParamDialog,
  setCurrentModel,
  setCurrentParam,
  setOpenModelExampleDialog,
  setCurrentExample,
}: {
  models: TableDataType | undefined;
  isLoading: boolean;
  searchParams: filterType;
  setSearchParams: (params: filterType) => void;
  handleAddModel: () => void;
  handleEditModel: (model: AiModel) => void;
  showDeleteModal: (aiModalId: string) => void;
  setOpenModelParamDialog: (open: boolean) => void;
  setCurrentModel: (models: AiModel) => void;
  setCurrentParam: (params: ModelParam[]) => void;
  setOpenModelExampleDialog: (open: boolean) => void;
  setCurrentExample: (examples: ModelExample[]) => void;
}) {
  const providerSelectOptionObject: { [key: string]: { text: string } } = {};
  modelProviders.forEach((option) => {
    providerSelectOptionObject[option.value] = { text: option.label };
  });
  const columns: ProColumns[] = [
    {
      title: "模型名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: "模型中文名称",
      dataIndex: "nameZh",
      key: "nameZh",
      width: 150,
      fixed: "left",
    },
    {
      title: "模型ID",
      dataIndex: "modelId",
      key: "modelId",
      width: 150,
    },
    {
      title: "封面",
      dataIndex: "imgUrl",
      key: "imgUrl",
      hideInSearch: true,
      valueType: "image",
      width: 100,
    },
    {
      title: "类别",
      dataIndex: "categories",
      key: "categories",
      hideInSearch: true,
      width: 100,
      render: (text) => {
        return (
          <div>
            {Array.isArray(text)
              ? text.map((item) => item.nameZh).join(",")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      hideInSearch: true,
      width: 100,
      render: (text) => {
        return <div>{text?.toString()}</div>;
      },
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      width: 150,
    },
    {
      title: "中文描述",
      dataIndex: "descZh",
      key: "descZh",
      width: 150,
    },
    {
      title: "单次花费",
      dataIndex: "cost",
      key: "cost",
      valueType: "digit",
      width: 120,
      sorter: (a, b) => {
        const costA = a.cost !== null ? a.cost : 0;
        const costB = b.cost !== null ? b.cost : 0;
        return costA - costB;
      },
    },
    {
      title: "运行次数",
      dataIndex: "runCount",
      key: "runCount",
      valueType: "digit",
      width: 120,
      sorter: (a, b) => {
        const runCountA = a.runCount !== null ? a.runCount : 0;
        const runCountB = b.runCount !== null ? b.runCount : 0;
        return runCountA - runCountB;
      },
    },
    {
      title: "预计运行时间",
      dataIndex: "estRunTime",
      key: "estRunTime",
      valueType: "digit",
      width: 120,
      sorter: (a, b) => {
        const estRunTimeA = a.estRunTime !== null ? a.estRunTime : 0;
        const estRunTimeB = b.estRunTime !== null ? b.estRunTime : 0;
        return estRunTimeA - estRunTimeB;
      },
    },
    {
      title: "运行环境",
      dataIndex: "runOn",
      key: "runOn",
      width: 120,
    },
    {
      title: "输出格式",
      dataIndex: "outputSchema",
      key: "outputSchema",
      valueType: "textarea",
      hideInSearch: true,
      render: (text) => {
        if (text === "-") {
          return <span>{text}</span>;
        } else {
          return <pre>{JSON.stringify(text, null, 2)}</pre>;
        }
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      key: "author",
      width: 100,
    },
    {
      title: "Github地址",
      dataIndex: "github",
      key: "github",
      width: 200,
      render: (text) => {
        if (text !== "-") {
          return (
            <a href={text as string} target="_blank" className="text-blue-500">
              {text}
            </a>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "论文地址",
      dataIndex: "paper",
      key: "paper",
      width: 200,
      render: (text) => {
        if (text !== "-") {
          return (
            <a href={text as string} target="_blank" className="text-blue-500">
              {text}
            </a>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "许可证",
      dataIndex: "license",
      key: "license",
      width: 200,
      render: (text) => {
        if (text !== "-") {
          return (
            <a href={text as string} target="_blank" className="text-blue-500">
              {text}
            </a>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "输出类别",
      dataIndex: "outputFormat",
      key: "outputFormat",
      valueType: "text",
      width: 100,
    },
    {
      title: "支持流式",
      dataIndex: "supportStream",
      key: "supportStream",
      width: 100,
      valueEnum: {
        true: {
          text: "是",
        },
        false: {
          text: "否",
        },
      },
    },
    {
      title: "供应商",
      dataIndex: "provider",
      key: "provider",
      width: 100,
      valueEnum: providerSelectOptionObject,
    },
    {
      title: "供应商模型名称",
      dataIndex: "providerModelName",
      key: "providerModelName",
      width: 200,
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEditModel(record)}
            className="bg-background text-foreground"
          >
            编辑
          </Button>
          <Button
            onClick={() => {
              setCurrentModel(record);
              setCurrentParam(record.params);
              setOpenModelParamDialog(true);
            }}
            className="bg-background text-foreground"
          >
            参数管理
          </Button>
          <TableDropdown
            key="actionGroup"
            onSelect={(key) => {
              if (key === "delete") {
                showDeleteModal(record.id);
              } else if (key === "example") {
                setCurrentModel(record);
                setCurrentExample(record.examples);
                setOpenModelExampleDialog(true);
              }
            }}
            menus={[
              { key: "example", name: "示例管理" },
              { key: "delete", name: "删除" },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      loading={isLoading}
      headerTitle="模型管理"
      columns={columns}
      dataSource={models?.data}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: models?.pageSize,
        total: models?.total,
        current: models?.current,
        onChange: (page, pageSize) => {
          setSearchParams({
            ...searchParams,
            current: page,
            pageSize,
          });
        },
      }}
      search={{
        labelWidth: "auto",
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
          onClick={handleAddModel}
          className="bg-background text-foreground"
        >
          新增模型
        </Button>,
      ]}
      onReset={() => {
        setSearchParams(defaultPageConfig);
      }}
      onSubmit={(params) => {
        if (typeof params.supportStream === "string") {
          params.supportStream = JSON.parse(params.supportStream);
        }
        setSearchParams(params);
      }}
    />
  );
}

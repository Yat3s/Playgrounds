"use client";

import { ProColumns, ProTable } from "@ant-design/pro-components";
import { AiModel, InputAssistTool, ModelParam } from "@prisma/client";
import { Button, Select, Space } from "antd";
import {
  ParamType,
  ParamTypeFormat,
} from "~/components/models/detail/playground/ParamInputForm";

export default function ParamTable({
  currentModel,
  currentParam,
  currentEditParamsIds,
  setCurrentEditParamsIds,
  handleAddDefaultModelParam,
  handleDeleteModelParam,
  handleEditModelParam,
  setOpenImportDataDialog,
}: {
  currentModel: AiModel | undefined;
  currentParam: ModelParam[] | undefined;
  currentEditParamsIds: string[];
  setCurrentEditParamsIds: (ids: string[]) => void;
  handleAddDefaultModelParam: (modelId: string) => void;
  handleDeleteModelParam: (id: string) => void;
  handleEditModelParam: (paramId: string, param: ModelParam) => void;
  setOpenImportDataDialog: (open: {
    open: boolean;
    modelId: string;
    type: "param" | "example";
  }) => void;
}) {
  const paramTypeObject: { [key: string]: { text: string } } = {};
  Object.keys(ParamType).forEach((key) => {
    const value = ParamType[key as keyof typeof ParamType];
    paramTypeObject[value] = { text: value };
  });

  const paramFormatObject: { [key: string]: { text: string } } = {};
  Object.keys(ParamTypeFormat).forEach((key) => {
    const value = ParamTypeFormat[key as keyof typeof ParamTypeFormat];
    paramFormatObject[value] = { text: value };
  });

  const paramAssistToolObject: { [key: string]: { text: string } } = {};
  // convert enum to object
  Object.keys(InputAssistTool).forEach((key) => {
    const value = InputAssistTool[key as keyof typeof InputAssistTool];
    paramAssistToolObject[value] = { text: value };
  });

  const paramsColumns: ProColumns<ModelParam>[] = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      valueType: "text",
      fixed: "left",
      formItemProps() {
        return {
          rules: [{ required: true, message: "name is required" }],
        };
      },
    },
    {
      title: "显示名称",
      dataIndex: "displayName",
      key: "displayName",
      valueType: "text",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      valueType: "text",
    },
    {
      title: "中文描述",
      dataIndex: "descZh",
      key: "descZh",
      valueType: "text",
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order",
      valueType: "digit",
      sorter: (a, b) => {
        const orderA = a.order !== null ? a.order : 0;
        const orderB = b.order !== null ? b.order : 0;
        return orderA - orderB;
      },
    },
    {
      title: "必填",
      dataIndex: "required",
      key: "required",
      sorter: (a, b) => {
        const requiredA = a.required !== null ? a.required : false;
        const requiredB = b.required !== null ? b.required : false;
        return requiredA === requiredB ? 0 : requiredA ? 1 : -1;
      },
      valueEnum: {
        true: {
          text: "是 ",
        },
        false: {
          text: "否",
        },
      },
      renderFormItem(schema, config, form, action) {
        return (
          <Select
            style={{ width: 100 }}
            options={[
              { label: "是", value: true },
              { label: "否", value: false },
            ]}
          />
        );
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      sorter: (a, b) => {
        const typeA = a.type !== null ? a.type : "";
        const typeB = b.type !== null ? b.type : "";
        return typeA.localeCompare(typeB);
      },
      valueEnum: paramTypeObject,
      formItemProps() {
        return {
          rules: [{ required: true, message: "type is required" }],
        };
      },
    },
    {
      title: "格式",
      dataIndex: "format",
      key: "format",
      sorter: (a, b) => {
        const formatA = a.format !== null ? a.format : "";
        const formatB = b.format !== null ? b.format : "";
        return formatA.localeCompare(formatB);
      },
      valueEnum: paramFormatObject,
    },
    {
      title: "默认值",
      dataIndex: "defaultValue",
      key: "defaultValue",
      valueType: "text",
    },
    {
      title: "枚举",
      dataIndex: "enum",
      key: "enum",
      valueType: "textarea",
      render: (text) => {
        return <div>{text?.toString()}</div>;
      },
    },
    {
      title: "最大值",
      dataIndex: "maximum",
      key: "maximum",
      valueType: "digit",
    },
    {
      title: "最小值",
      dataIndex: "minimum",
      key: "minimum",
      valueType: "digit",
    },
    {
      title: "辅助工具",
      dataIndex: "assistTool",
      key: "assistTool",
      valueEnum: paramAssistToolObject,
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      render: (text, record, _, action) => (
        <Space size="middle">
          <Button
            key="editable"
            className="bg-background text-foreground"
            onClick={() => {
              action?.startEditable?.(record.id);
              setCurrentEditParamsIds([...currentEditParamsIds, record.id]);
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      columns={paramsColumns}
      dataSource={currentParam}
      rowKey="id"
      search={false}
      scroll={{ x: "max-content" }}
      editable={{
        type: "multiple",
        editableKeys: currentEditParamsIds,
        onDelete: async (_, row) => {
          handleDeleteModelParam(row.id);
        },
        onSave: async (_, row) => {
          row.enum = row.enum?.toString().split(",");
          delete row.index;
          handleEditModelParam(row.id, row);
        },
        onCancel: async (key, _) => {
          setCurrentEditParamsIds(
            currentEditParamsIds.filter((id) => id !== key),
          );
        },
      }}
      toolBarRender={() => [
        <div className="flex gap-2">
          <Button
            type="primary"
            key="all"
            onClick={() => {
              currentModel &&
                setOpenImportDataDialog({
                  open: true,
                  modelId: currentModel.id,
                  type: "param",
                });
            }}
            className="bg-background text-foreground"
          >
            导入全部参数
          </Button>
          <Button
            type="primary"
            key="one"
            className="bg-background text-foreground"
            onClick={() => {
              currentModel && handleAddDefaultModelParam(currentModel.id);
            }}
          >
            新增默认参数
          </Button>
        </div>,
      ]}
    />
  );
}

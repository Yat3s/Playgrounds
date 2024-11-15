"use client";

import { ProColumns, ProTable } from "@ant-design/pro-components";
import { AiModel, ModelExample } from "@prisma/client";
import { Button, Input, Space } from "antd";
import OutputPreviewer from "~/components/models/detail/playground/outputs/OutputPreviewer";
import { OutputFormat } from "~/lib/enums";

export default function ExampleTable({
  currentModel,
  currentExample,
  currentEditExampleIds,
  setCurrentEditExampleIds,
  handleDeleteModelExample,
  handleEditModelExample,
  setOpenImportDataDialog,
}: {
  currentModel: AiModel | undefined;
  currentExample: ModelExample[] | undefined;
  currentEditExampleIds: string[];
  setCurrentEditExampleIds: (ids: string[]) => void;
  handleDeleteModelExample: (id: string) => void;
  handleEditModelExample: (
    exampleId: string,
    inputJson?: string,
    outputJson?: string,
  ) => void;
  setOpenImportDataDialog: (open: {
    open: boolean;
    modelId: string;
    type: "param" | "example";
  }) => void;
}) {
  const examplesColumns: ProColumns<ModelExample>[] = [
    {
      title: "参数Json",
      dataIndex: "paramJson",
      key: "paramJson",
      valueType: "textarea",
      hideInSearch: true,
      width: "40%",
      formItemProps() {
        return {
          rules: [{ required: true, message: "参数JSON是必填项" }],
        };
      },
      renderFormItem(schema, config, form, action) {
        return <Input.TextArea rows={5} />;
      },
      render: (text) => {
        if (text === "-") {
          return <span>{text}</span>;
        } else {
          return <div className="max-w-[300px] break-words">{text}</div>;
        }
      },
    },
    {
      title: "输出",
      dataIndex: "output",
      key: "output",
      valueType: "textarea",
      width: "40%",
      formItemProps() {
        return {
          rules: [{ required: true, message: "输出是必填项" }],
        };
      },
      renderFormItem(schema, config, form, action) {
        return <Input.TextArea rows={5} />;
      },
      render: (text) => {
        if (text === "-" || currentModel == null) {
          return <p>{text?.toString()}</p>;
        } else {
          return (
            <OutputPreviewer
              output={text as string[]}
              outputFormat={currentModel.outputFormat as OutputFormat}
            />
          );
        }
      },
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      width: "20%",
      render: (text, record, _, action) => (
        <Space size="middle">
          <Button
            key="editable"
            className="bg-background text-foreground"
            onClick={() => {
              action?.startEditable?.(record.id);
              setCurrentEditExampleIds([...currentEditExampleIds, record.id]);
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
      columns={examplesColumns}
      dataSource={currentExample}
      rowKey="id"
      search={false}
      scroll={{ x: "max-content" }}
      editable={{
        type: "multiple",
        editableKeys: currentEditExampleIds,
        onDelete: async (_, row) => {
          handleDeleteModelExample(row.id);
        },
        onSave: async (_, row) => {
          handleEditModelExample(
            row.id,
            row.paramJson?.toString(),
            JSON.stringify(row.output.toString().split(",")),
          );
        },
        onCancel: async (key, _) => {
          setCurrentEditExampleIds(
            currentEditExampleIds.filter((id) => id !== key),
          );
        },
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            currentModel &&
              setOpenImportDataDialog({
                open: true,
                modelId: currentModel.id,
                type: "example",
              });
          }}
          className="bg-background text-foreground"
        >
          导入示例
        </Button>,
      ]}
    />
  );
}

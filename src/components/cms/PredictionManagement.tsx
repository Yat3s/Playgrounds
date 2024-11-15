import { ProColumns, ProTable } from "@ant-design/pro-components";
import { AiModel, Prediction, User } from "@prisma/client";
import { Button, ConfigProvider, message, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import OutputPreviewer from "../models/detail/playground/outputs/OutputPreviewer";
import { cn, formatMillisecondsToSeconds } from "~/lib/utils";
import { OutputFormat } from "~/lib/enums";

type PredictionWithRelations = Prediction & {
  aiModel: AiModel;
  User: User;
};

type TableDataType = {
  data: PredictionWithRelations[];
  total: number;
  pageSize: number;
  current: number;
};

type FilterType = {
  current?: number;
  pageSize?: number;
  aiModel?: string;
  User?: string;
  createdAt?: Date;
};

const defaultPageConfig = {
  current: 1,
  pageSize: 50,
};

export default function PredictionManagement() {
  const [searchParams, setSearchParams] =
    useState<FilterType>(defaultPageConfig);
  const {
    data: predictionData,
    isLoading,
    refetch,
  } = api.cmsPrediction.fetchAll.useQuery(searchParams);
  const { mutateAsync: toggleExample } =
    api.cmsPrediction.toggleExample.useMutation();
  const [predictions, setPredictions] = useState<TableDataType>();

  useEffect(() => {
    if (!isLoading && predictionData) {
      setPredictions(predictionData);
    }
  }, [predictionData, isLoading]);

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  const handleToggleExample = async (predictionId: string) => {
    try {
      const response = await toggleExample({ predictionId });
      refetch();
      if (response.success) {
        message.success(response.message);
      } else {
        message.error("操作失败");
      }
    } catch (error) {
      message.error("操作失败");
    }
  };

  const columns: ProColumns[] = [
    {
      title: "模型",
      dataIndex: "aiModel",
      key: "aiModel",
      valueType: "textarea",
      width: 150,
      render: (text, record) => {
        if (text === "-" || text == null) {
          return <span>{text}</span>;
        } else {
          return <span>{record.aiModel.name}</span>;
        }
      },
    },
    {
      title: "输入",
      dataIndex: "input",
      key: "input",
      valueType: "textarea",
      hideInSearch: true,
      width: 300,
      render: (text) => {
        if (text === "-") {
          return <span>{text}</span>;
        } else {
          return (
            <div className="max-w-[300px] break-words">
              {JSON.stringify(text, null)}
            </div>
          );
        }
      },
    },
    {
      title: "输出",
      dataIndex: "output",
      key: "output",
      valueType: "textarea",
      hideInSearch: true,
      width: 300,
      render: (text, record) => {
        if (text === "-" || text == null) {
          return <span>{text}</span>;
        } else {
          return (
            <OutputPreviewer
              output={record.output.output as string[]}
              outputFormat={record.aiModel.outputFormat as OutputFormat}
            />
          );
        }
      },
    },
    {
      title: "运行时长",
      dataIndex: "runTime",
      key: "runTime",
      valueType: "text",
      hideInSearch: true,
      width: 120,
      sorter: (a, b) => {
        const runTimeA = a.runTime !== null ? a.runTime : 0;
        const runTimeB = b.runTime !== null ? b.runTime : 0;
        return runTimeA - runTimeB;
      },
      render: (text) => {
        if (text === "-" || text == null) {
          return <span>{text}</span>;
        } else {
          return <span>{formatMillisecondsToSeconds(Number(text))} 秒</span>;
        }
      },
    },
    {
      title: "用户",
      dataIndex: "User",
      key: "User",
      valueType: "textarea",
      width: 150,
      render: (text, record) => {
        if (text === "-" || text == null) {
          return <span>{text}</span>;
        } else {
          return <span>{record.User.email ?? record.User.phoneNumber}</span>;
        }
      },
    },
    {
      title: "记录时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "date",
      width: 150,
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className={cn(
              "text-foreground hover:!border-muted-foreground hover:!text-foreground",
              record.markedAsExample &&
                "bg-destructive hover:!border-destructive hover:!bg-destructive",
            )}
            onClick={() => handleToggleExample(record.id)}
          >
            {record.markedAsExample ? "取消示例" : "设为示例"}
          </Button>
        </Space>
      ),
    },
  ];

  const themeConfig = {
    algorithm: [theme.darkAlgorithm],
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <ProTable
        loading={isLoading}
        headerTitle="运行历史管理"
        columns={columns}
        dataSource={predictions?.data}
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: predictions?.pageSize,
          total: predictions?.total,
          current: predictions?.current,
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
        onReset={() => {
          setSearchParams(defaultPageConfig);
        }}
        onSubmit={(params) => {
          if (typeof params.createdAt === "string") {
            params.createdAt = new Date(params.createdAt);
          }
          setSearchParams(params);
        }}
      />
    </ConfigProvider>
  );
}

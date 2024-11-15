"use client";

import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { User } from "@prisma/client";
import { Button, ConfigProvider, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "~/lib/utils";
import { api } from "~/trpc/react";

type TableDataType = {
  data: User[];
  total: number;
  pageSize: number;
  current: number;
};

type filterType = {
  current?: number;
  pageSize?: number;
  name?: string;
  phoneNumber?: string;
  email?: string;
  role?: number;
};

export const defaultPageConfig = {
  current: 1,
  pageSize: 50,
};

export default function UserManagement() {
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] =
    useState<filterType>(defaultPageConfig);
  const {
    data: usersData,
    isLoading: userDateLoading,
    refetch: refetchUser,
  } = api.cmsUser.fetchAll.useQuery(searchParams);
  const [userTableData, setTableUserData] = useState<TableDataType>();
  const columns: ProColumns<User>[] = [
    {
      title: "用户名称",
      dataIndex: "name",
      key: "name",
      valueType: "text",
      width: "30%",
      order: 2,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      valueType: "text",
      width: "20%",
    },
    {
      title: "电话号码",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      valueType: "text",
      width: "20%",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "text",
      render: (_, record) => formatDateTime(record.createdAt.toISOString()),
      width: "20%",
    },
    {
      title: "权限",
      dataIndex: "role",
      key: "role",
      order: 1,
      sorter: (a, b) => {
        const roleA = a.role !== null ? a.role : 0;
        const roleB = b.role !== null ? b.role : 0;
        return roleA - roleB;
      },
      valueEnum: {
        0: {
          text: "普通用户(0)",
        },
        1024: {
          text: "管理员(1024)",
        },
      },
      width: "20%",
    },
  ];

  useEffect(() => {
    if (!userDateLoading && usersData) {
      setTableUserData(usersData);
    }
  }, [usersData, userDateLoading]);

  useEffect(() => {
    refetchUser();
  }, [searchParams, refetchUser]);

  const themeConfig = {
    algorithm: [theme.darkAlgorithm],
  };

  return (
    <>
      <ConfigProvider theme={themeConfig}>
        <ProTable
          loading={userDateLoading}
          headerTitle="用户管理"
          columns={columns}
          rowKey="key"
          actionRef={actionRef}
          pagination={{
            pageSize: userTableData?.pageSize,
            total: userTableData?.total,
            current: userTableData?.current,
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
          onReset={() => {
            setSearchParams(defaultPageConfig);
          }}
          onSubmit={(params) => {
            if (typeof params.role === "string") {
              params.role = parseInt(params.role);
            }
            setSearchParams(params);
          }}
          dataSource={userTableData?.data}
        />
      </ConfigProvider>
    </>
  );
}

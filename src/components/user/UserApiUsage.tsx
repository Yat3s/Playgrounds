import * as React from "react";
import UserApiUsageTable from "~/components/user/sections/UserApiUsageTable";

const UserApiUsage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-6 text-lg font-extrabold sm:text-2xl">用量查询</h1>
      <p className="mb-2 text-xs text-muted-foreground sm:text-sm">
        该统计为在某一段时间内的总使用量，可能存在延迟
      </p>
      <UserApiUsageTable />
    </div>
  );
};

export default UserApiUsage;

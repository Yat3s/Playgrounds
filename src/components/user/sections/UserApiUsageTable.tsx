import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const data = [
  {
    id: "1",
    createdAt: "2024/07/08 12:34:21",
    modelName: "test model name",
    requestCount: 92,
  },
  {
    id: "2",
    createdAt: "2024/07/08 12:34:21",
    modelName: "test model name",
    requestCount: 92,
  },
  {
    id: "3",
    createdAt: "2024/07/08 12:34:21",
    modelName: "test model name",
    requestCount: 92,
  },
];

const UserApiUsageTable = () => {
  return (
    <>
      {data && data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">请求时间</TableHead>
              <TableHead className="text-foreground">模型</TableHead>
              <TableHead className="text-right text-foreground">
                请求次数
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.createdAt}</TableCell>
                <TableCell className="flex cursor-pointer items-center underline underline-offset-2 hover:text-blue-700">
                  {item.modelName}
                </TableCell>
                <TableCell>{item.requestCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-10 text-center text-sm">暂无数据</div>
      )}
    </>
  );
};

export default UserApiUsageTable;

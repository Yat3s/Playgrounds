import { ModelCategory, ModelParam } from "@prisma/client";
import React from "react";
import { AiModel } from "../../models/ModelItem";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import ImportDataDialog from "./ImportModelDataDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

function ModelTable({
  models,
  onImportDialogChange,
}: {
  models: (AiModel & {
    params: ModelParam[];
    examples: ModelParam[];
    categories: ModelCategory[];
  })[];
  onImportDialogChange?: (open: boolean) => void;
}) {
  const [openImportDataDialog, setOpenImportDataDialog] = React.useState({
    open: false,
    modelId: "",
    type: "" as "param" | "example",
  });
  return (
    <>
      <Table className="bg-muted/50">
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>参数数量</TableHead>
            <TableHead>示例数量</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.params.length}</TableCell>
              <TableCell>{model.examples.length}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">打开菜单</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <div
                        onClick={() => {
                          setOpenImportDataDialog({
                            open: true,
                            modelId: model.id,
                            type: "param",
                          });
                        }}
                      >
                        导入参数
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div
                        onClick={() => {
                          setOpenImportDataDialog({
                            open: true,
                            modelId: model.id,
                            type: "example",
                          });
                        }}
                      >
                        导入示例
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ImportDataDialog
        type={openImportDataDialog.type}
        modelId={openImportDataDialog.modelId}
        open={openImportDataDialog.open}
        onOpenChange={(open) => {
          setOpenImportDataDialog({
            ...openImportDataDialog,
            open,
          });
          onImportDialogChange?.(open);
        }}
      />
    </>
  );
}
export default ModelTable;

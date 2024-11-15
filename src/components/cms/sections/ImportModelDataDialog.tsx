import React from "react";
import { api } from "~/trpc/react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";
import { Textarea } from "../../ui/textarea";
import { message, Modal } from "antd";
import { ModelExample, ModelParam } from "@prisma/client";

function ImportDataDialog({
  modelId,
  type,
  onOpenChange,
  open,
  handleRefresh,
  currentModelExample,
  setCurrentModelExample,
  setOpenModelParamDialog,
}: {
  modelId: string;
  type: "param" | "example";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleRefresh?: () => void;
  currentModelExample?: ModelExample[];
  setCurrentModelExample?: (modelExample: ModelExample[]) => void;
  setOpenModelParamDialog?: (open: boolean) => void;
}) {
  const [input, setInput] = React.useState<string>();
  const [output, setOutput] = React.useState<string>();
  const { mutateAsync: importParams } = api.cms.importParams.useMutation();
  const { mutateAsync: importExample } = api.cms.importExample.useMutation();
  return (
    <div>
      <Modal
        title="导入示例"
        open={open}
        zIndex={999}
        onOk={async () => {
          let importExampleRes;
          let importParamRes;
          if (!input) {
            message.error("输入不能为空");
            return;
          }

          switch (type) {
            case "param":
              if (!input) {
                message.error("输入不能为空");
                return;
              }
              try {
                importParamRes = await importParams({
                  modelId,
                  json: input,
                });
                if (importParamRes.success) {
                  message.success("导入成功");
                }
              } catch (e) {
                message.error("导入失败");
                console.error(e);
              }
              break;
            case "example":
              if (!output) {
                message.error("输出不能为空");
                return;
              }
              try {
                importExampleRes = await importExample({
                  modelId,
                  inputJson: input,
                  outputJson: output,
                });
                if (importExampleRes.success) {
                  message.success("导入成功");
                }
              } catch (e) {
                message.error("导入失败");
                console.error(e);
              }
              break;
          }

          onOpenChange(false);
          setInput("");
          setOutput("");

          if (type === "example") {
            if (importExampleRes?.success) {
              if (importExampleRes?.data) {
                importExampleRes.data.paramJson = JSON.stringify(
                  importExampleRes.data?.paramJson,
                  null,
                  2,
                );
                if (setCurrentModelExample && currentModelExample) {
                  setCurrentModelExample(
                    importExampleRes?.data
                      ? [...currentModelExample, importExampleRes.data]
                      : currentModelExample,
                  );
                }
              }
              if (handleRefresh) {
                handleRefresh();
              }
            }
          } else if (type === "param") {
            if (importParamRes?.success) {
              if (setOpenModelParamDialog) {
                setOpenModelParamDialog(false);
              }
              if (handleRefresh) {
                handleRefresh();
              }
            }
          }
        }}
        okText="导入"
        onCancel={() => onOpenChange(false)}
      >
        <DialogHeader>输入 JSON</DialogHeader>
        <Textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        {type === "example" && (
          <>
            <DialogHeader>输出 JSON</DialogHeader>
            <Textarea
              placeholder="['url1', 'url2']"
              value={output}
              onChange={(e) => {
                setOutput(e.target.value);
              }}
            />
          </>
        )}
      </Modal>
    </div>
  );
}

export default ImportDataDialog;

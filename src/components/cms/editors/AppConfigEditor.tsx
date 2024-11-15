"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AppConfig } from "@prisma/client";
import { message } from "antd";
import useNavigation from "~/hooks/useNavigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

type FieldName = "key" | "value";

type Field = {
  name: FieldName;
  label: string;
  type: "string";
};

const fields: Field[] = [
  {
    name: "key",
    label: "应用配置名称",
    type: "string",
  },
  {
    name: "value",
    label: "应用配置值",
    type: "string",
  },
];

interface AppConfigEditorProps {
  appConfig: AppConfig | undefined;
  onAppConfigUpdated: (data: AppConfig) => void;
  onAppConfigCreated: (data: AppConfig) => void;
}

const AppConfigEditor = ({
  appConfig,
  onAppConfigUpdated,
  onAppConfigCreated,
}: AppConfigEditorProps) => {
  const { replace } = useNavigation();

  const formSchema = z.object({
    key: z.string().min(1, { message: "配置名称不能为空" }),
    value: z.string().min(1, { message: "配置值不能为空" }),
  });

  const form = useForm<AppConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: appConfig?.key || "",
      value: appConfig?.value || "",
    },
  });

  useEffect(() => {
    form.reset(appConfig);
  }, [appConfig, form.reset]);

  const onSubmit = async (data: AppConfig) => {
    if (appConfig?.id) {
      await onAppConfigUpdated({
        ...appConfig,
        ...data,
      });
      message.success("配置更新成功");
    } else {
      await onAppConfigCreated(data);
      message.success("配置创建成功");
    }
    replace("/cms/app-config");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={() => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base font-bold">
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={`请输入${field.label}`}
                    {...form.register(field.name)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        ))}
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              replace("/cms/app-config");
            }}
            className="w-fit border bg-white text-black hover:bg-white/90"
          >
            返回
          </Button>
          <Button className="w-fit" type="submit">
            提交
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppConfigEditor;

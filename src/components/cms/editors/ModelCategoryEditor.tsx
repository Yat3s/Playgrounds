import { zodResolver } from "@hookform/resolvers/zod";
import { ModelCategory } from "@prisma/client";
import { message } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "~/components/ui/textarea";
import FileUpload from "../sections/FileUpload";
import useNavigation from "~/hooks/useNavigation";

type FieldName = "name" | "nameZh" | "order" | "icon";

type Field = {
  name: FieldName;
  label: string;
  type:
    | "string"
    | "string_array"
    | "number"
    | "boolean"
    | "json"
    | "file_string";
};

const fields: Field[] = [
  {
    name: "name",
    label: "模型分类英文名称",
    type: "string",
  },
  {
    name: "nameZh",
    label: "模型分类中文名称",
    type: "string",
  },
  {
    name: "order",
    label: "序号",
    type: "number",
  },
  {
    name: "icon",
    label: "图标",
    type: "file_string",
  },
];

interface ModelCategoryEditorProps {
  modelCategory: ModelCategory | undefined;
  onModelCategoryUpdated: (v: any) => void;
  onModelCategoryCreated: (v: any) => void;
}

const ModelCategoryEditor = ({
  modelCategory,
  onModelCategoryUpdated,
  onModelCategoryCreated,
}: ModelCategoryEditorProps) => {
  const { replace } = useNavigation();

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "模型分类英文名称不能为空",
    }),
    nameZh: z.string(),
    order: z.number().or(
      z
        .string()
        .min(1, {
          message: "序号不能为空",
        })
        .refine(
          (value) => {
            const number = Number(value);
            return Number.isInteger(number) && number >= 0;
          },
          { message: "请输入一个有效的整数" },
        ),
    ),
    icon: z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameZh: "",
      order: "0",
    },
  });

  useEffect(() => {
    if (modelCategory) {
      (Object.keys(modelCategory) as Array<keyof ModelCategory>).forEach(
        (key) => {
          if (key === "id") return;
          const value = modelCategory[key];
          if (typeof value === "number") {
            form.setValue(key, value.toString());
          } else {
            form.setValue(key, value ?? "");
          }
        },
      );
    }
  }, [modelCategory]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { name, nameZh, order, icon } = data;
    console.log("onSubmit", data);

    const modelCategoryData = {
      name,
      nameZh,
      order: typeof order === "string" ? parseInt(order, 10) : order,
      icon,
    };

    console.log(modelCategory?.id);

    if (modelCategory) {
      await onModelCategoryUpdated({
        ...modelCategoryData,
        modelCategoryId: modelCategory.id,
      });
      message.success("模型分类更新成功");
      replace("/cms/categories");
    } else {
      await onModelCategoryCreated(modelCategoryData);
      message.success("模型分类创建成功");
      replace("/cms/categories");
    }
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
                  {renderFormField(field, form.control)}
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
              replace("/cms/categories");
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

function renderFormField(categoryField: Field, control: any) {
  const placeholder = getPlaceholder(categoryField.name);

  switch (categoryField.type) {
    case "json":
      return (
        <Textarea
          rows={10}
          {...control.register(categoryField.name)}
          placeholder={placeholder}
        />
      );
    case "file_string":
      return (
        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, value } }) => (
            <FileUpload url={value} onSetUrl={onChange} />
          )}
        />
      );
    case "boolean":
      return (
        <select
          {...control.register(categoryField.name)}
          className="h-10 w-fit rounded-md border  px-2 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      );
    case "string":
      return (
        <Input
          placeholder={placeholder}
          {...control.register(categoryField.name)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          step={1}
          placeholder={placeholder}
          {...control.register(categoryField.name)}
        />
      );
    default:
      return (
        <Input
          placeholder={placeholder}
          {...control.register(categoryField.name)}
        />
      );
  }
}

function getPlaceholder(type: string): string {
  const placeholders: {
    [key: string]: string;
  } = {
    name: "模型分类英文名称",
    nameZh: "模型分类中文名称",
    order: "序号",
    icon: "图标",
  };

  return placeholders[type] || "";
}

export default ModelCategoryEditor;

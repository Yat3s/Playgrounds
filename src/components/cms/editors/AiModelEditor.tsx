import { zodResolver } from "@hookform/resolvers/zod";
import { AiModel, ModelCategory } from "@prisma/client";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { ScrollArea } from "../../ui/scroll-area";
import { Textarea } from "../../ui/textarea";
import FileUpload from "../sections/FileUpload";
import { modelProviders } from "~/lib/ai-model";
import { OutputFormat } from "~/lib/enums";
import useNavigation from "~/hooks/useNavigation";

type FieldName =
  | "modelId"
  | "name"
  | "nameZh"
  | "tags"
  | "desc"
  | "descZh"
  | "runOn"
  | "runCount"
  | "cost"
  | "estRunTime"
  | "imgUrl"
  | "outputSchema"
  | "author"
  | "github"
  | "paper"
  | "license"
  | "statusUrl"
  | "provider"
  | "providerModelName"
  | "supportStream"
  | "outputFormat"
  | "categories";

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
    label: "模型名称",
    type: "string",
  },
  {
    name: "nameZh",
    label: "模型中文名称",
    type: "string",
  },
  {
    name: "modelId",
    label: "模型ID",
    type: "string",
  },
  {
    name: "categories",
    label: "类别",
    type: "string_array",
  },
  {
    name: "tags",
    label: "标签",
    type: "string_array",
  },
  {
    name: "desc",
    label: "描述",
    type: "string",
  },
  {
    name: "descZh",
    label: "中文描述",
    type: "string",
  },
  {
    name: "cost",
    label: "单次费用",
    type: "number",
  },
  {
    name: "providerModelName",
    label: "供应商模型名称",
    type: "string",
  },
  {
    name: "provider",
    label: "供应商",
    type: "string",
  },
  {
    name: "supportStream",
    label: "支持流式",
    type: "boolean",
  },
  {
    name: "outputFormat",
    label: "输出类型",
    type: "string",
  },
  {
    name: "estRunTime",
    label: "预计运行时间",
    type: "number",
  },
  {
    name: "runOn",
    label: "运行环境",
    type: "string",
  },
  {
    name: "imgUrl",
    label: "封面",
    type: "file_string",
  },
  {
    name: "statusUrl",
    label: "模型状态查询链接",
    type: "string",
  },
  {
    name: "runCount",
    label: "运行次数",
    type: "number",
  },
  {
    name: "outputSchema",
    label: "输出格式",
    type: "json",
  },
  {
    name: "author",
    label: "作者",
    type: "string",
  },
  {
    name: "github",
    label: "Github地址",
    type: "string",
  },
  {
    name: "paper",
    label: "论文地址",
    type: "string",
  },
  {
    name: "license",
    label: "许可证",
    type: "string",
  },
];

interface AiModelEditorProps {
  model?: AiModel & {
    categories: ModelCategory[];
  };
}

function AiModelEditor({ model }: AiModelEditorProps) {
  const { replace } = useNavigation();

  const formSchema = z.object({
    name: z.string().min(1, {
      message: "模型名称不能为空",
    }),
    nameZh: z.string().min(1, {
      message: "模型名称不能为空",
    }),
    modelId: z.string().min(1, {
      message: "模型ID不能为空",
    }),
    categories: z.array(z.string()).refine(
      (value) => {
        return value.length > 0;
      },
      { message: "模型类别不能为空" },
    ),
    tags: z
      .array(z.string())
      .nonempty({ message: "标签不能为空" })
      .or(z.string().min(1, { message: "标签不能为空" })),
    desc: z.string().min(1, {
      message: "模型描述不能为空",
    }),
    descZh: z.string().optional(),
    runOn: z.string().optional(),
    statusUrl: z.string().optional(),
    runCount: z.number().or(
      z
        .string()
        .min(1, { message: "运行次数不能为空" })
        .refine(
          (value) => {
            const number = Number(value);
            return Number.isInteger(number) && number >= 0;
          },
          { message: "请输入一个整数" },
        ),
    ),
    cost: z.number().or(
      z
        .string()
        .min(1, { message: "单次运行费用不能为空" })
        .refine(
          (value) => {
            const number = Number(value);
            return number >= 0;
          },
          { message: "请输入一个大于等于0的数" },
        ),
    ),
    estRunTime: z.number().or(
      z
        .string()
        .min(1, { message: "预计运行时间不能为空" })
        .refine(
          (value) => {
            const number = Number(value);
            return number >= 0;
          },
          { message: "请输入一个大于等于0的数" },
        ),
    ),
    imgUrl: z.string().optional(),
    outputSchema: z.string().optional(),
    author: z.string().optional(),
    github: z.string().optional(),
    paper: z.string().optional(),
    license: z.string().optional(),
    provider: z.string(),
    providerModelName: z.string().optional(),
    supportStream: z.boolean().or(z.string()),
    outputFormat: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameZh: "",
      modelId: "",
      categories: [],
      tags: [],
      desc: "",
      descZh: "",
      runOn: "",
      runCount: 0,
      cost: 0,
      estRunTime: 0,
      imgUrl: "",
      outputSchema: "",
      author: "",
      github: "",
      paper: "",
      license: "",
      outputFormat: "uri",
      supportStream: false,
      provider: "r",
      providerModelName: "",
    },
  });
  const { mutateAsync: createModel } = api.cmsModel.create.useMutation();
  const { mutateAsync: updateModel } = api.cmsModel.update.useMutation();
  const { data: categories, isLoading } =
    api.cmsModel.fetchCategories.useQuery();

  const [categoriesData, setCategoriesData] = React.useState<ModelCategory[]>();

  React.useEffect(() => {
    if (!isLoading && categories) {
      setCategoriesData(categories);
    }
  }, [categories, isLoading]);

  React.useEffect(() => {
    if (model) {
      (Object.keys(model) as Array<keyof typeof model>).forEach((key) => {
        if (key === "outputSchema" && model[key] !== undefined) {
          const outputSchemaStr = JSON.stringify(model[key], null, 2);
          form.setValue(key, outputSchemaStr);
        } else if (key === "categories") {
          form.setValue(
            key,
            model[key].map((category: ModelCategory) => category.id),
          );
        } else {
          if (key === "id" || key === "createdAt" || key === "outputSchema")
            return;

          if (key === "supportStream") {
            form.setValue(key, model[key] === true ? true : false);
          }

          if (key === "tags") {
            form.setValue(key, model[key]?.join(", "));
          } else {
            form.setValue(key, model[key] ?? undefined);
          }
        }
      });
    }
  }, [model, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const modelData = buildModelObject(data);

    const submissionData = {
      ...modelData,
      categories: data.categories,
    };

    console.log("submissionData", submissionData);

    if (model?.id) {
      await updateModel(
        {
          aiModelId: model.id,
          json: JSON.stringify(submissionData),
        },
        {
          onSuccess: () => {
            toast.success("模型更新成功");
            replace("/cms/models");
          },
          onError: (error) => {
            console.log(error);
          },
        },
      );
    } else {
      await createModel(
        {
          json: JSON.stringify(submissionData),
        },
        {
          onSuccess: () => {
            toast.success("模型创建成功");
            replace("/cms/models");
          },
        },
      );
    }
  };

  return (
    <>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="mb-2 mt-[6vh] w-full">
              <div className="m-1 space-y-4">
                {fields.map((modelField) => {
                  return (
                    <FormField
                      key={modelField.name}
                      control={form.control}
                      name={(modelField as Field).name}
                      render={() => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base font-bold">
                            {modelField.label}
                          </FormLabel>
                          <FormControl>
                            {renderFormField(
                              modelField,
                              form.control,
                              categoriesData,
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            </ScrollArea>
            <div className="fixed right-0 top-0 flex h-[10vh] w-[101%] items-center justify-end gap-4 bg-transparent pr-16 backdrop-blur-md">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  replace("/cms/models");
                }}
                variant="outline"
                className="w-fit"
              >
                返回
              </Button>
              <Button type="submit">提交</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

function buildModelObject(input: any) {
  const model: any = {};
  fields.forEach((field) => {
    const value = input[field.name];
    switch (field.type) {
      case "string_array":
        if (!Array.isArray(value)) {
          model[field.name] = value
            ? value.split(",").map((item: any) => item.trim())
            : [];
        } else {
          model[field.name] = value;
        }
        break;
      case "number":
        model[field.name] = parseFloat(value);
        break;
      case "boolean":
        model[field.name] = value === "true";
        break;
      default:
        model[field.name] = value;
    }
  });
  // Remove undefined fields
  Object.keys(model).forEach(
    (key) => model[key] === undefined && delete model[key],
  );
  return model;
}

function renderFormField(
  modelField: Field,
  control: any,
  categories?: ModelCategory[],
) {
  const placeholder = getPlaceholder(modelField.name);

  switch (modelField.type) {
    case "json":
      return (
        <Textarea
          rows={10}
          {...control.register(modelField.name)}
          placeholder={placeholder}
        />
      );
    case "file_string":
      return (
        <Controller
          control={control}
          name="imgUrl"
          render={({ field: { onChange, value } }) => (
            <FileUpload url={value} onSetUrl={onChange} />
          )}
        />
      );
    case "boolean":
      return (
        <select
          {...control.register(modelField.name)}
          className="h-10 w-fit rounded-md border px-2 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    case "string":
      if (modelField.name === "provider") {
        return (
          <select
            {...control.register(modelField.name)}
            className="h-10 w-fit rounded-md border px-2 shadow-sm focus:border-primary focus:ring-primary"
          >
            {modelProviders.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      if (modelField.name === "outputFormat") {
        return (
          <select
            {...control.register(modelField.name)}
            className="h-10 w-fit rounded-md border px-2 shadow-sm focus:border-primary focus:ring-primary"
          >
            {Object.values(OutputFormat).map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        );
      }
      return (
        <Input
          placeholder={placeholder}
          {...control.register(modelField.name)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          step={
            modelField.name === "runCount"
              ? 1
              : modelField.name === "cost"
                ? 0.01
                : 0.1
          }
          placeholder={placeholder}
          {...control.register(modelField.name)}
        />
      );
    case "string_array":
      if (modelField.name === "categories") {
        return (
          <select
            {...control.register(modelField.name)}
            className="h-24 w-fit rounded-md border px-2 shadow-sm focus:border-primary focus:ring-primary"
            multiple
          >
            {categories &&
              categories.map((category: ModelCategory) => (
                <option key={category.id} value={category.id}>
                  {category.nameZh}
                </option>
              ))}
          </select>
        );
      } else {
        return (
          <Input
            placeholder={placeholder}
            {...control.register(modelField.name)}
          />
        );
      }
    default:
      return (
        <Input
          placeholder={placeholder}
          {...control.register(modelField.name)}
        />
      );
  }
}

function getPlaceholder(type: string): string {
  const placeholders: {
    [key: string]: string;
  } = {
    name: "模型名称",
    nameZh: "模型中文名称",
    modelId: "模型ID",
    tags: "标签1,标签2,标签3",
    desc: "模型描述",
    descZh: "模型中文描述",
    runOn: "运行环境",
    outputSchema: `
    {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uri"
      },
      "title": "Output"
    }`,
    author: "作者",
    github: "Github地址",
    paper: "论文地址",
    license: "许可证",
    providerModelName: "Provider模型名称",
  };

  return placeholders[type] || "";
}

export default AiModelEditor;

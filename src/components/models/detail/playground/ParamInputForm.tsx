"use client";

import { ModelParam } from "@prisma/client";
import React from "react";
import { ListIcon } from "~/components/common/Icons";
import BooleanInput from "~/components/models/detail/playground/inputs/BooleanInput";
import NumberInput from "~/components/models/detail/playground/inputs/NumberInput";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import ChatMessageListInput from "./inputs/ChatMessageListInput";
import EnumInput from "./inputs/EnumInput";
import FileInput from "./inputs/FileInput";
import StringInput from "./inputs/StringInput";
import { useTranslation } from "react-i18next";

export enum ParamType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  ChatMessages = "chat_messages",
  ChatMessagesSystemRole = "chat_messages_system_role",
}

export enum ParamTypeFormat {
  File = "uri",
  Enum = "enum",
  Integer = "integer",
  Float = "float",
}

type InputViewProps = {
  modelParams: ModelParam[];
  values: { [key: string]: string };
  onChange: (paramName: string, value: string) => void;
};

const ParamInputForm = ({ modelParams, values, onChange }: InputViewProps) => {
  const { t } = useTranslation();
  const requiredParams = modelParams.filter((param) => param.required);
  const optionalParams = modelParams.filter((param) => !param.required);

  const renderComponents = (params: ModelParam[]) => {
    return params.map((param, index) => {
      const { name, type, format } = param;

      switch (type) {
        case ParamType.String:
          if (format === ParamTypeFormat.File) {
            return (
              <FileInput
                param={param}
                key={index}
                value={values[name]}
                onChange={(value: string) => onChange(name, value)}
              />
            );
          } else if (format === ParamTypeFormat.Enum) {
            return (
              <EnumInput
                param={param}
                key={index}
                value={values[name]}
                onChange={(value: string) => onChange(name, value)}
              />
            );
          } else {
            return (
              <StringInput
                key={index}
                param={param}
                value={values[name]}
                onChange={(value: string) => onChange(name, value)}
              />
            );
          }
        case ParamType.Number:
          if (format === ParamTypeFormat.Enum) {
            return (
              <EnumInput
                param={param}
                key={index}
                value={values[name]}
                onChange={(value: string) => onChange(name, value)}
              />
            );
          }
          return (
            <NumberInput
              param={param}
              key={index}
              value={values[name]}
              onChange={(value: string) => onChange(name, value)}
            />
          );
        case ParamType.Boolean:
          return (
            <BooleanInput
              param={param}
              key={index}
              value={values[name]}
              onChange={(value: string) => onChange(name, value)}
            />
          );
        case ParamType.ChatMessages:
        case ParamType.ChatMessagesSystemRole:
          return (
            <ChatMessageListInput
              param={param}
              key={index}
              value={values[name]}
              onChange={(value: string) => onChange(name, value)}
              systemRoleSupported={ParamType.ChatMessagesSystemRole === type}
            />
          );
        default:
          return null;
      }
    });
  };

  const [showOptionalParams, setShowOptionalParams] = React.useState(
    requiredParams.length === 0,
  );

  return (
    <Collapsible open={showOptionalParams} onOpenChange={setShowOptionalParams}>
      <div className="flex flex-col gap-8">
        {renderComponents(requiredParams)}
      </div>
      {requiredParams.length > 0 && optionalParams.length > 0 && (
        <CollapsibleTrigger className="mt-12 flex w-full items-center gap-2 rounded bg-muted p-3 ">
          <ListIcon className="h-5 w-5" />
          <span className="font-bold">
            {showOptionalParams ? t("Hide") : t("Show")}{" "}
            {t("Advanced Parameters")} ({optionalParams.length})
          </span>
        </CollapsibleTrigger>
      )}

      <CollapsibleContent>
        <div className="mt-4 flex flex-col gap-8">
          {renderComponents(optionalParams)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ParamInputForm;

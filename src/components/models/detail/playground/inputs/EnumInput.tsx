"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";
import { useTranslation } from "react-i18next";

const EnumInput = ({ param, value, onChange }: BaseInputViewProps) => {
  const { t } = useTranslation();
  const enumValue = param.enum as any;

  return (
    <BaseInputView param={param} value={value} onChange={onChange}>
      <Select
        key={param.name}
        value={value}
        onValueChange={(value) => {
          onChange(value);
        }}
      >
        <SelectTrigger className="w-fit border bg-background font-semibold dark:border-muted-foreground/20">
          <SelectValue placeholder={t("Select an option")} />
        </SelectTrigger>
        <SelectContent>
          {enumValue.map((val: any, index: any) => (
            <SelectItem key={index} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseInputView>
  );
};

export default EnumInput;

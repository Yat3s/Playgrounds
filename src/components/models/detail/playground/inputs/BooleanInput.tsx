"use client";

import { Switch } from "~/components/ui/switch";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";

const BooleanInput = ({ param, value, onChange }: BaseInputViewProps) => {
  const checked = value === "true";

  return (
    <BaseInputView param={param} value={value} onChange={onChange}>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => onChange(checked ? "true" : "false")}
      />
    </BaseInputView>
  );
};

export default BooleanInput;

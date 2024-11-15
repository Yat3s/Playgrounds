"use client";

import * as React from "react";
import { Input } from "~/components/ui/input";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";

const NumberInput = ({ param, value, onChange }: BaseInputViewProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <BaseInputView param={param} value={value} onChange={onChange}>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        step={param.maximum && param.maximum > 1 ? 1 : 0.1}
        min={param.minimum != null ? param.minimum : 0}
        max={param.maximum != null ? param.maximum : ""}
        placeholder={`${param.minimum || ""}${param.minimum && param.maximum ? "-" : ""}${param.maximum || ""}`}
        className="dark:border-muted-foreground/20"
      />
    </BaseInputView>
  );
};

export default NumberInput;

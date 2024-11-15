import { Textarea } from "~/components/ui/textarea";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";

const StringInput = ({ param, value, onChange }: BaseInputViewProps) => {
  return (
    <BaseInputView param={param} value={value} onChange={onChange}>
      <Textarea
        className="border bg-background p-4 focus:outline-none dark:border-muted-foreground/20 "
        rows={3}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </BaseInputView>
  );
};

export default StringInput;

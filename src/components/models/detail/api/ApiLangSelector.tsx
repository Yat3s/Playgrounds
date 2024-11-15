"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ApiLangOption, CurlLang, NodeLang, PythonLang } from "~/lib/code";

const allLangOptions = [PythonLang, NodeLang, CurlLang];

interface ApiLangSelectorProps {
  language: ApiLangOption;
  onSetLanguage: (language: ApiLangOption) => void;
}

export function ApiLangSelector({
  language,
  onSetLanguage,
}: ApiLangSelectorProps) {
  return (
    <Select
      defaultValue={language.name}
      onValueChange={(value: string) => {
        const lang = allLangOptions.find((lang) => lang.name === value);
        if (!lang) return;
        onSetLanguage(lang);
      }}
    >
      <SelectTrigger className="w-fit border-none bg-muted-foreground/10 font-bold text-white ring-0 focus:ring-0 focus:ring-offset-0">
        <SelectValue>
          <div className="mr-2 flex items-center gap-2 text-sm">
            {language.name}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allLangOptions
            .map((option) => option.name)
            .map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

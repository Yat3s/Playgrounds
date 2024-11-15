"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { ClearIcon, SearchIcon } from "~/components/common/Icons";
import { Input } from "~/components/ui/input";
import { sendGAEvent } from "@next/third-parties/google";

interface SearchInputProps {
  onInputChange?: (v: string) => void;
}

const SearchInput = ({ onInputChange }: SearchInputProps) => {
  const { t } = useTranslation();
  const [input, setInput] = React.useState<string>();

  return (
    <div className="flex h-12 w-fit items-center">
      <SearchIcon className="h-5 w-5" />
      <Input
        className="border-none bg-transparent pl-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={t("Search models / APIs")}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (onInputChange) {
            onInputChange(e.target.value);
            sendGAEvent({ event: "searchModels", value: `${Date.now()}` });
          }
        }}
      />

      <ClearIcon
        visibility={input ? "visible" : "hidden"}
        onClick={() => {
          setInput("");
          if (onInputChange) {
            onInputChange("");
          }
        }}
        className="h-7 w-7 cursor-pointer text-muted lg:left-[30vw] xl:left-[30vw]"
      />
    </div>
  );
};

export default SearchInput;

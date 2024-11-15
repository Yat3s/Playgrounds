"use client";

import { ModelCategory } from "@prisma/client";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import ModelItem, { AiModel } from "./ModelItem";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "../user/settings/LanguageSelector";

interface ModelGridListProps {
  modelsByCategory?:
    | {
        category: ModelCategory;
        models: AiModel[];
      }[]
    | undefined;
  isLoading?: boolean;
}

const ModelGridList = ({ modelsByCategory, isLoading }: ModelGridListProps) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  return (
    <div className="space-y-32">
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[16rem] rounded-xl sm:h-[22rem]"
            />
          ))}
        </div>
      ) : (
        modelsByCategory &&
        modelsByCategory.map((item) => (
          <div key={item.category.id}>
            <div className="flex items-center gap-4">
              <Image
                src={item.category.icon ?? "/ic_default_category.svg"}
                alt="fire"
                width={36}
                height={36}
              />
              <span className="text-2xl font-bold">
                {currentLocale === LanguageLocale.English
                  ? item.category.name
                  : item.category.nameZh}
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-4">
              {item.models.map((model) => (
                <ModelItem key={model.id} model={model}></ModelItem>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ModelGridList;

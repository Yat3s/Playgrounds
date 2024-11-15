"use client";

import { ModelCategory } from "@prisma/client";
import Image from "next/image";
import * as React from "react";
import SearchInput from "~/components/models/SearchInput";
import { api } from "~/trpc/react";
import { PlayIcon } from "../common/Icons";
import { Skeleton } from "../ui/skeleton";
import ModelGridList from "./ModelGridList";
import { AiModel } from "./ModelItem";
import { useTranslation } from "react-i18next";
import { LanguageLocale } from "../user/settings/LanguageSelector";
import useNavigation from "~/hooks/useNavigation";

const MAX_POPULAR_MODEL_COUNT = 5;

const ModelMainPage = () => {
  const { data: allModels, isLoading } = api.model.fetchAll.useQuery();
  const { data: categories } = api.model.fetchCategories.useQuery();

  // TODO, pagination
  const [popularModels, setPopularModels] = React.useState<AiModel[]>();
  const [inSearchMode, setInSearchMode] = React.useState(false);
  const [modelsByCategory, setModelsByCategory] = React.useState<
    {
      category: ModelCategory;
      models: AiModel[];
    }[]
  >();

  React.useEffect(() => {
    if (allModels) {
      if (categories) {
        setModelsByCategory(aggregateModels(allModels, categories));
      }

      const topRunModels = allModels
        .sort((a, b) => b.runCount - a.runCount)
        .slice(0, MAX_POPULAR_MODEL_COUNT);
      setPopularModels(topRunModels);
    }
  }, [allModels, categories]);

  const handleSearch = (keyword: string) => {
    if (!allModels || !categories) {
      return;
    }

    if (!keyword) {
      setInSearchMode(false);
      setModelsByCategory(aggregateModels(allModels, categories));
      return;
    }

    setInSearchMode(true);

    const filteredModels = allModels.filter((model) => {
      const keywordLowerCase = keyword.toLowerCase();
      return (
        model.name.toLowerCase().includes(keywordLowerCase) ||
        model.desc.toLowerCase().includes(keywordLowerCase) ||
        model.descZh?.toLowerCase().includes(keywordLowerCase) ||
        model.tags.includes(keywordLowerCase)
      );
    });

    setModelsByCategory(aggregateModels(filteredModels, categories));
  };

  return (
    <div className="mx-auto xl:max-w-[1440px]">
      <div className="w-fit border-b">
        <SearchInput
          onInputChange={(v) => {
            handleSearch(v);
          }}
        />
      </div>

      {!inSearchMode && (
        <div className="mb-24 mt-16">
          <PopularModelGridList
            models={popularModels || []}
            isLoading={isLoading}
          />
        </div>
      )}

      <ModelGridList
        modelsByCategory={modelsByCategory}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModelMainPage;

const PopularModelGridList = ({
  models,
  isLoading,
}: {
  models: AiModel[];
  isLoading: boolean;
}) => {
  const { navigate } = useNavigation();
  const { i18n, t } = useTranslation();
  const currentLocale = i18n.language;

  return (
    <>
      <div className="flex items-center gap-4">
        <Image
          src="/ic_default_category.svg"
          alt="fire"
          width={36}
          height={36}
        />
        <span className="text-2xl font-bold">{t("Hot Models")}</span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-5">
        {isLoading
          ? Array.from({ length: MAX_POPULAR_MODEL_COUNT }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[20rem] rounded-xl sm:h-[22rem]"
              />
            ))
          : models.map((item) => (
              <div
                onClick={() => {
                  navigate(`/models/${item.id}`);
                }}
                key={item.id}
                className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-muted-foreground/40 bg-black hover:bg-muted/50"
              >
                <div className="relative h-48">
                  <Image
                    src={item.imgUrl || ""}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <h1 className="truncate text-xl font-bold">
                    {currentLocale === LanguageLocale.English
                      ? item.name
                      : item.nameZh ?? item.name}
                  </h1>
                  <div className="mt-1 flex-1 text-sm text-muted-foreground">
                    {currentLocale === LanguageLocale.English
                      ? item.desc
                      : item.descZh ?? item.desc}
                  </div>
                  <div className="mt-12 flex items-center justify-between ">
                    <span className="text-sm text-muted-foreground">
                      {item.runCount} {t("runs")}
                    </span>
                    <div className="flex items-center gap-1 ">
                      <PlayIcon className="h-3 w-3 " />
                      <span className="text-sm font-bold">{t("Run")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

const aggregateModels = (models: AiModel[], categories: ModelCategory[]) => {
  const modelsByCategory: {
    category: ModelCategory;
    models: AiModel[];
  }[] = [];

  categories.forEach((category) => {
    const categoryModels = models.filter((model) =>
      model.categories.some((ctg) => ctg.id === category.id),
    );

    if (categoryModels.length > 0) {
      modelsByCategory.push({
        category,
        models: categoryModels,
      });
    }
  });

  // Sort by category.order
  modelsByCategory.sort((a, b) => {
    return (a.category.order ?? 0) - (b.category.order ?? 0);
  });

  return modelsByCategory;
};

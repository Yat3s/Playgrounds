import { useSidebar } from "~/hooks/useSidebar";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import ModelDetailTitle from "~/components/models/detail/ModelDetailTitle";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import ApiLayout from "./api/ApiLayout";
import PlaygroundLayout from "./playground/PlaygroundLayout";

export type ModelId = {
  modelId: string;
};

const QUERY_TAB = "tab";

export enum Tab {
  PLAYGROUND = "playground",
  API = "api",
}

const ModelDetailMainPage = ({ modelId }: { modelId: string }) => {
  const searchParams = useSearchParams();
  let tab = searchParams.get(QUERY_TAB) as Tab | null;
  if (!tab || !Object.values(Tab).includes(tab as Tab)) {
    tab = Tab.PLAYGROUND;
  }

  const { data: model } = api.model.fetchById.useQuery({
    id: modelId,
  });

  const { collapseSidebar } = useSidebar();

  React.useEffect(() => {
    collapseSidebar();
  }, [model]);

  return (
    <div className="flex h-full flex-col">
      {model ? (
        <>
          <div className="z-40 w-full bg-background">
            <ModelDetailTitle model={model} tab={tab} />
          </div>

          {tab === Tab.PLAYGROUND && <PlaygroundLayout model={model} />}
          {tab === Tab.API && <ApiLayout model={model} />}
        </>
      ) : (
        <div className="space-y-4">
          <Skeleton className="h-[100px] w-full rounded-xl" />
          <div className="flex h-[90vh] gap-4">
            <Skeleton className="h-full w-full flex-1 rounded-xl" />
            <Skeleton className="h-full w-full flex-1 rounded-xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelDetailMainPage;

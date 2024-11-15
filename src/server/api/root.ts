import { modelRouter } from "~/server/api/routers/model";
import { storageRouter } from "~/server/api/routers/storage";
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { cmsRouter } from "./routers/cms";
import { cmsAppConfigRouter } from "./routers/cms-app-config";
import { cmsModelCategoryRouter } from "./routers/cms-category";
import { cmsModelRouter } from "./routers/cms-model";
import { cmsModelExampleRouter } from "./routers/cms-model-example";
import { cmsModelParamRouter } from "./routers/cms-model-param";
import { cmsPredictionRouter } from "./routers/cms-prediction";
import { cmsUserRouter } from "./routers/cms-user";
import { configRouter } from "./routers/config";
import { predictionRouter } from "./routers/prediction";
import { toolRouter } from "./routers/tool";

export const appRouter = createTRPCRouter({
  user: userRouter,
  model: modelRouter,
  storage: storageRouter,
  config: configRouter,
  cms: cmsRouter,
  cmsUser: cmsUserRouter,
  cmsModel: cmsModelRouter,
  cmsModelCategory: cmsModelCategoryRouter,
  cmsModelExample: cmsModelExampleRouter,
  cmsModelParam: cmsModelParamRouter,
  cmsAppConfig: cmsAppConfigRouter,
  cmsPrediction: cmsPredictionRouter,
  tool: toolRouter,
  prediction: predictionRouter,
});

export type AppRouter = typeof appRouter;

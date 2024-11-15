"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { AiModel, ModelExample, ModelParam } from "@prisma/client";
import { useSession } from "next-auth/react";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ModelActionPanel from "~/components/models/detail/playground/ModelActionPanel";
import ParamInputForm, {
  ParamType,
} from "~/components/models/detail/playground/ParamInputForm";
import { useModal } from "~/hooks/useStore";
import {
  FIRST_RUN_MODEL_WELCOME_MESSAGE,
  SHOW_CONTACT_MODAL_DELAY,
} from "~/lib/constants";
import { OutputFormat } from "~/lib/enums";
import {
  celebrateWithConfetti,
  cleanObject,
  cn,
  sleep,
  toJsonObject,
} from "~/lib/utils";
import { api } from "~/trpc/react";
import OutputPreviewer from "./outputs/OutputPreviewer";
import PredictingLoading from "./outputs/PredictLoading";
import StreamPredictDelegate from "./outputs/StreamPredictDelegate";

const PREDICT_TIME_INCREMENT_INTERVAL = 100;

const PlaygroundLayout = ({
  model,
}: {
  model: AiModel & {
    params: ModelParam[];
    examples: ModelExample[];
  };
}) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { toggleAuthModal, toggleContactModal } = useModal();
  const modelParams = model.params;

  // Initial values
  const initialInputValues = model.examples[0]?.paramJson ?? {};
  const initialOutput = model.examples[0]?.output ?? [];

  // User input values
  const [inputValues, setInputValues] = React.useState<{
    [key: string]: string;
  }>(initialInputValues as any);
  const handleInputValueChange = (name: string, value: string) => {
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [requestBody, setRequestBody] = React.useState<{
    modelId: string;
    input: any;
  }>();

  // Model output
  const [output, setOutput] = React.useState<string[] | string | undefined>(
    initialOutput,
  );
  const [isPredicting, setIsPredicting] = React.useState(false);
  const [predictTime, setPredictTime] = React.useState(0);
  const [isPredictTimeout, setIsPredictTimeout] = React.useState(false);
  // This is a workaround to dispatch the submit button click to StreamPredictDelegate
  const [submitClickCount, setSubmitClickCount] = React.useState(0);

  // Apis
  const { mutateAsync: runModel } = api.model.runModel.useMutation();
  const { mutateAsync: validateUserCredits } =
    api.user.validateUserCredits.useMutation();
  const { refetch: fetchUserPredictionCount } =
    api.prediction.fetchUserPredictionCount.useQuery(undefined, {
      enabled: false,
    });

  const onExampleSelect = (example: ModelExample) => {
    setInputValues(example.paramJson as any);
    setOutput(example.output);
  };

  useEffect(() => {
    const inputBody = buildParameters(modelParams, inputValues);
    setRequestBody({
      modelId: `${model.modelId}`,
      input: inputBody,
    });
  }, [inputValues]);

  const startPredictTimer = () => {
    setPredictTime(0);
    setIsPredictTimeout(false);

    const interval = setInterval(() => {
      setPredictTime((prev) => {
        const newTime = prev < model.estRunTime ? prev + 0.1 : prev;

        if (newTime >= model.estRunTime) {
          stopPredictTimer(interval);
          setIsPredictTimeout(true);
        }

        return newTime;
      });
    }, PREDICT_TIME_INCREMENT_INTERVAL);
    return interval;
  };

  const stopPredictTimer = (interval: NodeJS.Timeout) => {
    clearInterval(interval);
  };

  const handleSubmit = async () => {
    sendGAEvent({ event: "runModel", value: `${Date.now()}` });
    if (!session) {
      toggleAuthModal(true);
      return;
    }
    if (!verifyParams(t, modelParams, requestBody?.input).pass) {
      return;
    }

    const userCreditsValid = await validateUserCredits({ cost: model.cost });
    if (!userCreditsValid.isSufficient) {
      toast.error(userCreditsValid.message);
      return;
    }

    if (model.supportStream) {
      setSubmitClickCount((prev) => prev + 1);
      // Stream predictDelegate will handle the request
    } else {
      setIsPredicting(true);
      const predictTimer = startPredictTimer();
      const output = await runModel({
        id: model.id,
        requestBody: requestBody,
      });

      setOutput(output);
      stopPredictTimer(predictTimer);
      setIsPredicting(false);

      const cacheKey = `userHasRunModel-${session.user.id}`;
      if (!localStorage.getItem(cacheKey)) {
        const userPredictionCount = await fetchUserPredictionCount();
        if (userPredictionCount.data === 1) {
          await sleep(SHOW_CONTACT_MODAL_DELAY);
          toggleContactModal(true);
          celebrateWithConfetti(t(FIRST_RUN_MODEL_WELCOME_MESSAGE));
        }
        localStorage.setItem(cacheKey, "true");
      }
    }
  };

  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-6 lg:flex-row">
        <BorderTitleContainer title={t("Input")} className="mt-4">
          {modelParams && (
            <ParamInputForm
              modelParams={modelParams}
              values={inputValues}
              onChange={handleInputValueChange}
            />
          )}

          <div className="sticky bottom-0">
            <ModelActionPanel
              examples={model.examples}
              onExampleSelect={onExampleSelect}
              onRun={handleSubmit}
              model={model}
            />
          </div>
        </BorderTitleContainer>
        <BorderTitleContainer
          title={t("Output")}
          borderStyle={BorderStyle.Solid}
          className="mt-4 flex flex-col gap-2"
        >
          {model.supportStream ? (
            <div>
              <StreamPredictDelegate
                submitClickCount={submitClickCount}
                requestBody={requestBody}
              />
            </div>
          ) : isPredicting ? (
            <PredictingLoading
              predictTime={predictTime}
              model={model}
              isPredictTimeout={isPredictTimeout}
            />
          ) : output ? (
            <OutputPreviewer
              output={output}
              outputFormat={model.outputFormat as OutputFormat}
            />
          ) : null}
        </BorderTitleContainer>
      </div>
      <div></div>
    </section>
  );
};

const buildParameters = (
  schemas: ModelParam[],
  inputValues: { [key: string]: string },
) => {
  const parameters: { [key: string]: any } = {};
  schemas.forEach((param) => {
    const { name, type, defaultValue } = param;
    const inputValue = inputValues[name];
    switch (type) {
      case ParamType.String:
        parameters[name] = inputValue || defaultValue;
        break;
      case ParamType.Number:
        parameters[name] = inputValue
          ? Number(inputValue)
          : defaultValue
            ? Number(defaultValue)
            : undefined;
        break;
      case ParamType.Boolean:
        parameters[name] = inputValue
          ? Boolean(inputValue)
          : defaultValue === "true";
        break;
      case ParamType.ChatMessages:
      case ParamType.ChatMessagesSystemRole:
        parameters[name] = inputValue
          ? Array.isArray(inputValue)
            ? inputValue
            : toJsonObject(inputValue)
          : [];
        break;
      default:
        break;
    }
  });

  return cleanObject(parameters);
};

const verifyParams = (
  t: Function,
  schemas: ModelParam[],
  parameters: { [key: string]: any },
) => {
  let failedParam: string | null = null;

  schemas.forEach((param) => {
    const { required, name } = param;
    const value = parameters[name];
    if (required && !value) {
      toast.error(`${t("Parameter")} ${name} ${t("is required")}`);
      failedParam = name;
    }
    if (
      param.type === ParamType.ChatMessages &&
      (!value || value.length === 0)
    ) {
      toast.error(`${t("Parameter")} ${name} ${t("cannot be empty")}`);
      failedParam = name;
    }
    if (param.type === ParamType.Number) {
      if (value !== undefined && value !== null && value !== "") {
        if (isNaN(value)) {
          toast.error(`${t("Parameter")} ${name} ${t("must be a number")}`);
          failedParam = name;
        } else {
          if (+value < 0 && !param.minimum) {
            toast.error(
              `${t("Parameter")} ${name} ${t("must be greater than or equal to 0")}`,
            );
            failedParam = name;
          }
          if (param.minimum && +value < param.minimum) {
            toast.error(
              `${t("Parameter")} ${name} ${t("must be greater than")} ${param.minimum}`,
            );
            failedParam = name;
          }
          if (param.maximum && +value > param.maximum) {
            toast.error(
              `${t("Parameter")} ${name} ${t("must be less than")} ${param.maximum}`,
            );
            failedParam = name;
          }
        }
      } else if (required) {
        toast.error(`${t("Parameter")} ${name} ${t("is required")}`);
        failedParam = name;
      }
    }
  });

  return {
    pass: !failedParam,
    failedParam,
  };
};

export default PlaygroundLayout;

enum BorderStyle {
  Dashed,
  Solid,
}

const BorderTitleContainer = ({
  className,
  children,
  title,
  borderStyle = BorderStyle.Dashed,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  borderStyle?: BorderStyle;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col gap-8 rounded-lg border border-muted-foreground/30 p-6 pt-12",
        borderStyle === BorderStyle.Dashed ? "border-dashed" : "border-solid",
        className,
      )}
    >
      <div className="absolute -top-4 left-6 rounded-full bg-[#3d3d3d] px-4 py-2 text-[13px] font-bold leading-4 tracking-widest">
        {title}
      </div>
      {children}
    </div>
  );
};

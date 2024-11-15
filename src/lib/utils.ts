import { clsx, type ClassValue } from "clsx";
import { createHash } from "crypto";
import { generateApiKey as genApiKey } from "generate-api-key";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { IncompatibleBrowser } from "~/lib/enums";
import confetti from "canvas-confetti";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date
    .toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-")
    .replace(",", ""); // Remove the "," between date and time
};

export const generateFileBlobName = (fileName: string) => {
  const extension = fileName.split(".").pop();
  const blobName = `${Date.now()}.${extension}`;
  return blobName;
};

export const generateApiKey = () => {
  return genApiKey({
    method: "string",
    pool: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length: 32,
    prefix: "xm",
  }) as string;
};

export const hashApiKey = (apiKey: string): string => {
  return createHash("sha256")
    .update(apiKey + process.env.API_KEY_SALT)
    .digest("hex")
    .substring(0, 32);
};

export const maskApiKey = (input: string) => {
  if (input.length <= 8) {
    return input;
  }

  const start = input.slice(0, 4);
  const end = input.slice(-4);

  const stars = "*".repeat(input.length - 8);

  return start + stars + end;
};

export const truncateString = (input: string, length: number) => {
  if (input.length <= length) {
    return input;
  }

  return input.substring(0, length) + "...";
};

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  let newObj = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") {
      newObj[key as keyof T] = value;
    }
  }

  return newObj as Partial<T>;
}

export function parseReplicateParamJson(modelId: string, inputJson: string) {
  const input = JSON.parse(inputJson);
  const requiredFields = new Set(input.required || []);
  return Object.entries(input.properties).map(([key, value]) => {
    const item = value as any;
    let format = item.format;
    const enumValue = item.enum
      ? item.enum.map((v: string) => String(v))
      : undefined;
    if (item.enum && item.enum.length > 0) {
      format = "enum";
    } else if (item.type === "integer") {
      format = "integer";
    } else if (item.type === "number") {
      format = "float";
    }
    return {
      aiModelId: modelId,
      name: key,
      displayName: (value as any).title,
      desc: item.description || "",
      descZh: item.description,
      order: item["x-order"] || 0,
      required: requiredFields.has(key),
      type: item.type === "integer" ? "number" : item.type,
      format,
      defaultValue:
        item.default != undefined ? String(item.default) : undefined,
      enum: enumValue,
      maximum: typeof item.maximum === "number" ? item.maximum : undefined,
      minimum: typeof item.minimum === "number" ? item.minimum : undefined,
    };
  });
}

export const toJsonObject = (obj: any) => {
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (error) {
      console.error(`Error parsing JSON string:`, error);
      return {};
    }
  }
  return obj;
};

export const formatMillisecondsToSeconds = (
  milliseconds: number,
  decimalPlaces: number = 2,
): string => {
  const seconds = milliseconds / 1000;
  return seconds.toFixed(decimalPlaces);
};

export const isIncompatibleBrowser = (): boolean => {
  const userAgent = navigator.userAgent;
  const incompatibleBrowsers = Object.values(IncompatibleBrowser).map(
    (browser) => new RegExp(browser, "i"),
  );
  return incompatibleBrowsers.some((regex) => regex.test(userAgent));
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const celebrateWithConfetti = (info: string) => {
  confetti({
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  });
  return toast.success(info, { icon: "🥳" });
};

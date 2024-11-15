import mustache from "mustache";

type RequestConfig = {
  method: string;
  url: string;
  headers: {
    [key: string]: string;
  };
  data: {
    modelId: string;
    version?: string;
    input: object;
  };
};

export const createRequestConfig = (
  modelId: string, // Not object Id
  modelParams: any,
): RequestConfig => {
  return {
    method: "POST",
    url: "https://api.x-model.ai/v1/predict",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_API_KEY`,
    },
    data: {
      modelId: modelId,
      input: modelParams,
    },
  };
};

export type ApiLangOption = {
  name: ApiLang;
  hljsLang: string;
};

export enum ApiLang {
  Node = "Node.js",
  Python = "Python",
  Curl = "CURL",
}

export const NodeLang: ApiLangOption = {
  name: ApiLang.Node,
  hljsLang: "language-typescript",
};

export const PythonLang: ApiLangOption = {
  name: ApiLang.Python,
  hljsLang: "language-python",
};

export const CurlLang: ApiLangOption = {
  name: ApiLang.Curl,
  hljsLang: "language-bash",
};

export const generateApiCodeSnippet = (
  lang: ApiLangOption,
  config: RequestConfig,
) => {
  switch (lang.name) {
    case ApiLang.Node:
      return generateNodeSnippet(config);
    case ApiLang.Python:
      return generatePythonSnippet(config);
    case ApiLang.Curl:
      return generateCurlSnippet(config);
  }
};

const CURL_TEMPLATE = `curl -X POST '{{{url}}}' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer $YOUR_API_KEY' \\
  -d '{
    "modelId": "{{{modelId}}}",
    "input": {{{input}}}
  }'
`;

const PYTHON_TEMPLATE = `import requests
import json

url = "{{{url}}}"
payload = {
  "modelId": "{{{modelId}}}",
  "input": {{{input}}}
}
headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY"
}
response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

print(response.text)
`;

const NODE_TEMPLATE = `const axios = require("axios");
const url = "{{{url}}}";

const postData = {
    modelId: "{{{modelId}}}",
    input: {{{input}}},
};

const config = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY",
    }
};

axios.post(url, postData, config)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error("Request failed:", error);
    });
`;

const generateCurlSnippet = (config: RequestConfig): string => {
  const { url, data } = config;

  const view = {
    url,
    modelId: data.modelId,
    input: JSON.stringify(data.input),
  };

  return mustache.render(CURL_TEMPLATE, view);
};

const generatePythonSnippet = (config: RequestConfig): string => {
  const { url, data } = config;

  const view = {
    url,
    modelId: data.modelId,
    input: JSON.stringify(data.input),
  };

  return mustache.render(PYTHON_TEMPLATE, view);
};

const generateNodeSnippet = (config: RequestConfig): string => {
  const { url, data } = config;

  const view = {
    url,
    modelId: data.modelId,
    input: JSON.stringify(data.input),
  };

  return mustache.render(NODE_TEMPLATE, view);
};

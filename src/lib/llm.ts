import OpenAI from "openai";

export const openAiCall = async ({
  systemPrompt,
  prompt,
  model = "gpt-3.5-turbo",
}: {
  systemPrompt: string,
  prompt: string,
  model: string,
}
) => {
  const openai = new OpenAI();
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    model,
  });
  return completion.choices[0]?.message.content;
};

export const translateToZh = async (texts: string[]) => {
  const promises = texts.map((text) =>
    openAiCall({
      systemPrompt: "",
      prompt: `请将这个 API 参数翻译成中文 ${text}`,
      model: "gpt-3.5-turbo",
    })
  );
  return await Promise.all(promises);
};


"use client";

import { useChat } from "ai/react";
import { useEffect } from "react";
import { MessageRole } from "~/lib/enums";

const StreamPredictDelegate = ({
  submitClickCount,
  requestBody,
}: {
  submitClickCount: number;
  requestBody: any;
}) => {
  const { messages, setMessages, handleSubmit, reload } = useChat({
    body: requestBody,
  });
  useEffect(() => {
    if (submitClickCount > 0) {
      setMessages(requestBody.input.messages);
      reload();
      const e = new Event("submit");
      handleSubmit(e as any);
    }
  }, [submitClickCount]);
  return (
    <div className="space-y-1">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <span className="mr-2 font-bold">
            {m.role === MessageRole.USER
              ? "User: "
              : m.role === MessageRole.SYSTEM
                ? "System:"
                : "Assistant: "}
          </span>
          {m.content}
        </div>
      ))}
    </div>
  );
};

export default StreamPredictDelegate;

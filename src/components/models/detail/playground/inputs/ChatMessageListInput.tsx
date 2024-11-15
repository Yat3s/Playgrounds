"use client";

import React, { useEffect } from "react";
import { MinusIcon } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import BaseInputView, { BaseInputViewProps } from "./BaseInputView";
import { MessageRole } from "~/lib/enums";
import { useTranslation } from "react-i18next";

type ChatMessage = {
  role: MessageRole;
  content: string;
};

const parseValue = (value: string): ChatMessage[] => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return value;
};

const ChatMessageListInput = ({
  param,
  value,
  onChange,
  systemRoleSupported = false,
}: BaseInputViewProps & {
  systemRoleSupported: boolean;
}) => {
  const { t } = useTranslation();
  let initialMessages = value ? parseValue(value) : [];
  let initialSystemMessage = "";

  if (
    systemRoleSupported &&
    initialMessages.length &&
    initialMessages[0]?.role === MessageRole.SYSTEM
  ) {
    initialSystemMessage = initialMessages[0]?.content;
    initialMessages = initialMessages.slice(1);
  }

  if (initialMessages.length === 0) {
    initialMessages.push({
      role: MessageRole.USER,
      content: "",
    });
  }

  const [chatMessages, setChatMessages] =
    React.useState<ChatMessage[]>(initialMessages);
  const [systemMessage, setSystemMessage] =
    React.useState<string>(initialSystemMessage);

  const buildMessages = () => {
    const messages = [];
    if (systemRoleSupported && systemMessage !== undefined) {
      messages.push({
        role: MessageRole.SYSTEM,
        content: systemMessage,
      });
    }

    for (const message of chatMessages) {
      if (message.content === "") {
        continue;
      }
      messages.push(message);
    }
    return messages;
  };

  useEffect(() => {
    const messages = buildMessages();
    onChange(JSON.stringify(messages));
  }, [chatMessages, systemMessage]);

  return (
    <BaseInputView param={param} value={value} onChange={onChange}>
      <div className="space-y-4 rounded-lg border bg-muted/60 p-8">
        {systemRoleSupported && (
          <div className="space-y-2">
            <span className="text-sm font-bold">{t("System")}</span>
            <Textarea
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              rows={2}
            ></Textarea>
          </div>
        )}
        {chatMessages.map((message, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Select
              key={param.name}
              value={message.role}
              onValueChange={(e) => {
                const newMessages = [...chatMessages];
                newMessages[index]!.role = e as MessageRole;
                setChatMessages(newMessages);
              }}
            >
              <SelectTrigger className="w-32 border bg-background font-semibold ">
                <SelectValue placeholder={t("Select a role")}>
                  {message.role.slice(0, 1).toUpperCase() +
                    message.role.slice(1)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[MessageRole.ASSISTANT, MessageRole.USER].map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.slice(0, 1).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={message.content}
              onChange={(e) => {
                const newMessages = [...chatMessages];
                newMessages[index]!.content = e.target.value;
                setChatMessages(newMessages);
              }}
            />
            <MinusIcon
              className="h-4 w-4 cursor-pointer text-muted-foreground/40 hover:text-muted-foreground/75"
              onClick={() => {
                const newMessages = [...chatMessages];
                newMessages.splice(index, 1);
                setChatMessages(newMessages);
              }}
            />
          </div>
        ))}
        <Button
          className=""
          size={"sm"}
          onClick={() => {
            setChatMessages([
              ...chatMessages,
              {
                role:
                  chatMessages[chatMessages.length - 1]?.role ===
                  MessageRole.USER
                    ? MessageRole.ASSISTANT
                    : MessageRole.USER,
                content: "",
              },
            ]);
          }}
        >
          {t("Add message")}
        </Button>
      </div>
    </BaseInputView>
  );
};

export default ChatMessageListInput;

"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";
import SmsAuthForm from "~/components/auth/SmsAuthForm";
import { IconGitHub, IconGoogle } from "~/components/common/Icons";
import { Separator } from "~/components/ui/separator";
import { AuthProvider } from "~/lib/enums";

enum AuthType {
  SMS,
}

const AuthFormContent = () => {
  const { t } = useTranslation();
  const [authType, setAuthType] = React.useState(AuthType.SMS);
  const handleAuthTypeChange = (authType: AuthType) => {
    setAuthType(authType);
  };
  const [phoneNumber, setPhoneNumber] = React.useState<string>();
  const [code, setCode] = React.useState<string>();

  const handleSignIn = (provider: AuthProvider) => {
    signIn(provider);
  };

  return (
    <div className="shrink-0 rounded-2xl p-8">
      <div className="text-2xl font-bold">{t("Sign In")}</div>

      <div className="mt-5 flex space-x-6">
        <IconGoogle
          className="h-8 w-8 cursor-pointer"
          onClick={() => handleSignIn(AuthProvider.Google)}
        />
        <IconGitHub
          className="h-8 w-8 cursor-pointer"
          onClick={() => handleSignIn(AuthProvider.Github)}
        />
      </div>

      <div className="mt-6 flex items-center">
        <Separator className="flex-1" />
        <div className="mx-4 text-xs text-muted-foreground">{t("Or")}</div>
        <Separator className="flex-1" />
      </div>

      <div className="mt-6 flex items-center text-sm">
        <div
          onClick={() => {
            handleAuthTypeChange(AuthType.SMS);
          }}
          className={`${
            authType === AuthType.SMS
              ? "font-bold"
              : "cursor-pointer text-muted-foreground"
          }`}
        >
          {t("Sign in with Phone Number")}
        </div>
      </div>

      {authType === AuthType.SMS && (
        <SmsAuthForm
          code={code}
          phoneNumber={phoneNumber}
          onSetCode={setCode}
          onSetPhoneNumber={setPhoneNumber}
        />
      )}
    </div>
  );
};

export default AuthFormContent;

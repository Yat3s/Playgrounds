"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useModal } from "~/hooks/useStore";
import { IconSpinner } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useTranslation } from "react-i18next";
import useNavigation from "~/hooks/useNavigation";
import { celebrateWithConfetti } from "~/lib/utils";
import { FIRST_SIGN_IN_MESSAGE } from "~/lib/constants";

const SMS_COUNTDOWN = 60;
const SMS_COUNTDOWN_INTERVAL = 1000;
const PHONE_NUMBER_LENGTH = 11;

const SendVerificationCodeContainer = (props: any) => {
  const { t } = useTranslation();
  const { phoneNumber } = props;
  const [seconds, setSeconds] = useState(SMS_COUNTDOWN);
  const [isCountdown, setIsCountdown] = useState(false);

  const sendVerifyCode = api.user.sendVerifyCode.useMutation({
    onSuccess(data) {
      const { requestId } = data;

      if (requestId) {
        props.onVerificationCodeSmsSent(requestId);
      }
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCountdown && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, SMS_COUNTDOWN_INTERVAL);
    } else if (seconds === 0) {
      setIsCountdown(false);
    }

    return () => clearInterval(interval);
  }, [isCountdown, seconds]);

  const handleSendVerificationCode = () => {
    if (!phoneNumber || phoneNumber.length !== PHONE_NUMBER_LENGTH) {
      toast.error(t("Please enter a valid phone number"));
      return;
    }

    if (isCountdown) {
      return;
    }

    setIsCountdown(true);
    setSeconds(SMS_COUNTDOWN);

    sendVerifyCode.mutate(props.phoneNumber);
    props.onVerificationCodeRequestSent(true);
  };

  return (
    <span
      className="flex-shrink-0 cursor-pointer"
      onClick={handleSendVerificationCode}
    >
      {isCountdown ? `${seconds}s` : t("Get")}
    </span>
  );
};

interface SmsAuthFormProps {
  code: string | undefined;
  phoneNumber: string | undefined;
  onSetPhoneNumber: (v: string) => void;
  onSetCode: (v: string) => void;
}

export default function SmsAuthForm({
  code,
  phoneNumber,
  onSetPhoneNumber,
  onSetCode,
}: SmsAuthFormProps) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { data: session, status } = useSession();
  const [codeSent, setCodeSent] = useState(false);
  const [codeRequestId, setCodeRequestId] = useState<string>();
  const [isSignIn, setIsSignIn] = useState(false);
  const [attemptedSignIn, setAttemptedSignIn] = useState(false);

  const { toggleAuthModal, toggleSignInModal } = useModal();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isNewUser) {
      toggleSignInModal(true);
      celebrateWithConfetti(t(FIRST_SIGN_IN_MESSAGE) + "!");
      setAttemptedSignIn(false);
    }
  }, [attemptedSignIn]);

  const handleSmsAuth = () => {
    if (!phoneNumber || phoneNumber.length !== 11) {
      toast.error(t("Please enter a valid phone number"));
      return;
    }

    if ((code?.length ?? 0) < 4) {
      toast.error(t("Please enter a valid verification code"));
      return;
    }

    setIsSignIn(true);
    setAttemptedSignIn(true);
    signIn("credentials", {
      requestId: codeRequestId,
      code: code,
      phoneNumber,
      redirect: false,
    })
      .then((res) => {
        if (res?.error) {
          return;
        } else {
          toggleAuthModal(false);
          navigate("/models");
        }
      })
      .catch((err) => {
        return;
      })
      .finally(() => {
        setIsSignIn(false);
        setAttemptedSignIn(false);
      });
  };

  const onVerificationCodeSmsSent = (requestId: string) => {
    setCodeRequestId(requestId);
  };

  const onVerificationCodeRequestSent = (sent: boolean) => {
    setCodeSent(sent);
  };

  return (
    <>
      <Input
        disabled={codeSent}
        type="phone"
        className="mt-4 w-full"
        value={phoneNumber || ""}
        onChange={(e) => {
          onSetPhoneNumber(e.target.value);
        }}
        placeholder={t("Please enter your phone number")}
      />

      <div className="relative mt-4 flex items-center">
        <Input
          className="w-full"
          type="text"
          value={code || ""}
          onChange={(e) => {
            onSetCode(e.target.value);
          }}
          placeholder={t("Please enter the verification code")}
        />

        <div className="absolute right-3 text-sm">
          <SendVerificationCodeContainer
            phoneNumber={phoneNumber}
            onVerificationCodeSmsSent={onVerificationCodeSmsSent}
            onVerificationCodeRequestSent={onVerificationCodeRequestSent}
          />
        </div>
      </div>

      <Button
        disabled={!phoneNumber || !code || code.length < 4}
        className="mt-8 w-full cursor-pointer bg-foreground transition-all hover:bg-foreground/95"
        onClick={handleSmsAuth}
      >
        {isSignIn && <IconSpinner className="mr-2 animate-spin" />}{" "}
        {t("Sign In")}
      </Button>
    </>
  );
}

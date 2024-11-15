"use client";

import dynamic from "next/dynamic";
import { ButtonIcon, LogoIcon } from "~/components/common/Icons";
import { Button } from "~/components/ui/button";
import { Trans, useTranslation } from "react-i18next";
import { sendGAEvent } from "@next/third-parties/google";
import useNavigation from "~/hooks/useNavigation";
import ImageTabs from "~/components/animations/ImageTab";
import MobileImageTabs from "~/components/animations/MobileImageTab";

const Particles = dynamic(() => import("~/components/animations/Particles"), {
  ssr: false,
});

export default function Home() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const handleGetStarted = () => {
    navigate("/models");
    sendGAEvent({ event: "homePageGetStarted", value: `${Date.now()}` });
  };
  const tabs = [
    { title: t("image_generation"), image: "/images/Group2847.png" },
    { title: t("image_editing"), image: "/images/Group2844.png" },
    { title: t("sound_synthesis"), image: "/images/Group2848.png" },
    { title: t("music_creation"), image: "/images/Group2849.png" },
    { title: t("video_production"), image: "/images/Group2857.png" },
    { title: t("text_generation"), image: "/images/Group2841.png" },
  ];
  const tabsMobile = [
    { title: t("image_generation"), image: "/images/Group2847.png" },
    { title: t("image_editing"), image: "/images/Group2844.png" },
    { title: t("sound_synthesis"), image: "/images/Group2850.png" },
    { title: t("music_creation"), image: "/images/Group2849.png" },
    { title: t("video_production"), image: "/images/Group2857.png" },
    { title: t("text_generation"), image: "/images/Group2841.png" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background px-0 xl:flex-row xl:px-0">
      <div className="mb-10 mt-28 w-full xl:hidden">
        <MobileImageTabs tabs={tabsMobile} />
      </div>
      <main className="relative flex w-full flex-col items-center  justify-center xl:ml-8 xl:w-1/2 ">
        <div className="flex w-full flex-col items-center sm:max-w-none sm:items-start">
          <div className="flex w-full justify-center">
            <div className="mx-auto flex max-w-2xl flex-col items-start">
              <h1 className="flex items-center text-left text-base font-extrabold tracking-tight text-customGray sm:text-lg md:text-xl lg:text-3xl xl:gap-4">
                <LogoIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" /> X
                Model
              </h1>
              <div className="mt-2 w-full text-left text-4xl font-black text-customGray lg:text-5xl xl:py-9 xl:text-5xl 2xl:text-6xl">
                <Trans
                  i18nKey="exploreAI"
                  components={{
                    tc: <span className="font-black text-white" />,
                    br: (
                      <>
                        <br />
                        <span className="my-4 block"></span>
                      </>
                    ),
                  }}
                >
                  Explore popular
                  <span className="font-black text-white">AI models</span>,
                  <br />
                  and integrate them into your product
                </Trans>
              </div>
              <Button
                size="lg"
                className="z-20 mb-16 mt-4 hidden font-bold hover:bg-white/70 md:inline-flex"
                onClick={handleGetStarted}
              >
                {t("Get Started")}
                <span className="mx-1"></span>
                <ButtonIcon />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <div className=" mt-6 flex justify-center">
        <Button
          size="lg"
          className="z-20 mb-16 mt-4 w-2/3 rounded-sm font-bold hover:bg-white/70 sm:hidden"
          onClick={handleGetStarted}
        >
          {t("Get Started")}
          <span className="mx-1"></span>
          <ButtonIcon />
        </Button>
      </div>
      <div className="mr-20 hidden w-full items-center justify-center xl:flex xl:w-1/2">
        <ImageTabs tabs={tabs} />
      </div>
    </div>
  );
}

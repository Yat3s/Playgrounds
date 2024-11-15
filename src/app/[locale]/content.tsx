"use client";

import GradientBorderLayout from "~/components/common/GradientBorderLayout";
import { cn } from "~/lib/utils";

interface ContentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentLayout({
  children,
  className,
}: ContentLayoutProps) {
  return (
    <GradientBorderLayout
      className={cn(
        "mx-auto lg:my-8 lg:rounded-xl 2xl:max-w-[1440px]",
        className,
      )}
    >
      <div className="bg-background p-10 lg:rounded-xl">{children}</div>
    </GradientBorderLayout>
  );
}

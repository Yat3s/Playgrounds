"use client";

import { cn } from "~/lib/utils";

interface ContentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientBorderLayout({
  children,
  className,
}: ContentLayoutProps) {
  return (
    <div className={cn("bg-border-gradient p-px", className)}>{children}</div>
  );
}

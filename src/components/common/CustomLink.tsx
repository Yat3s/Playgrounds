"use client";

import { AnchorHTMLAttributes, MouseEventHandler } from "react";
import Link from "next/link";
import useNavigation from "~/hooks/useNavigation";
import { isIncompatibleBrowser } from "~/lib/utils";

interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  const { navigate } = useNavigation();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    navigate(href);
  };

  if (isIncompatibleBrowser()) {
    return (
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default CustomLink;

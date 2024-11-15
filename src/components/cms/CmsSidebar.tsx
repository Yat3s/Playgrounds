"use client";

import {
  DesktopOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { UsersRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LogoIcon } from "../common/Icons";
import useNavigation from "~/hooks/useNavigation";
import CustomLink from "../common/CustomLink";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

export const MENU_ITEM_KEYS = {
  USER_INFO: "1",
  MODEL_INFO: "2",
  MODEL_CATEGORY: "3",
  PREDICTION: "4",
  APP_CONFIG: "5",
  MODEL_PROVIDER: "6",
};

const menuLinks = {
  [MENU_ITEM_KEYS.USER_INFO]: "/users",
  [MENU_ITEM_KEYS.MODEL_INFO]: "/models",
  [MENU_ITEM_KEYS.MODEL_CATEGORY]: "/categories",
  [MENU_ITEM_KEYS.PREDICTION]: "/predictions",
  [MENU_ITEM_KEYS.APP_CONFIG]: "/app-config",
  [MENU_ITEM_KEYS.MODEL_PROVIDER]: "/modelproviders",
};

const items: MenuItem[] = [
  getItem(
    "用户信息",
    MENU_ITEM_KEYS.USER_INFO,
    <UsersRound className="h-4 w-4" />,
  ),
  getItem("模型信息", MENU_ITEM_KEYS.MODEL_INFO, <DesktopOutlined />),
  getItem("模型分类", MENU_ITEM_KEYS.MODEL_CATEGORY, <PieChartOutlined />),
  getItem("运行历史", MENU_ITEM_KEYS.PREDICTION, <PieChartOutlined />),
  getItem("应用配置", MENU_ITEM_KEYS.APP_CONFIG, <SettingOutlined />),
  getItem(" 模型提供商", MENU_ITEM_KEYS.MODEL_PROVIDER, <SettingOutlined />),
];

export default function CmsSidebar({
  selectedMenu,
  onSelectMenu,
}: {
  selectedMenu: string;
  onSelectMenu: (key: string) => void;
}) {
  const { navigate } = useNavigation();
  const pathname = `/${usePathname().split("/").pop()}`;

  useEffect(() => {
    if (pathname === "/cms") {
      navigate("/cms/users");
    }
  }, [pathname]);

  const handleMenuSelect = ({ key }: { key: string }) => {
    onSelectMenu(key);
    navigate(`/cms${menuLinks[key]}`);
  };

  return (
    <div className="bg-gray-1100">
      <CustomLink
        href="/"
        className="flex w-full items-center justify-center p-8 font-semibold "
      >
        <LogoIcon className="h-12 w-12" />
      </CustomLink>
      <Menu
        selectedKeys={[selectedMenu]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        items={items}
        className="bg-gray-1100 flex h-screen flex-col items-center gap-2 px-4"
        onSelect={handleMenuSelect}
      />
    </div>
  );
}

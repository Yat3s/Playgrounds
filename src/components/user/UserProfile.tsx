"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  ActiveUserAccountIcon,
  ActiveUserApiKeysIcon,
  ActiveUserSettingsIcon,
  DefaultUserAccountIcon,
  DefaultUserApiKeysIcon,
  DefaultUserSettingsIcon,
} from "~/components/common/Icons";
import UserAccount from "~/components/user/UserAccount";
import UserApiKeys from "~/components/user/UserApiKeys";
import UserSettings from "~/components/user/UserSettings";
import { cn } from "~/lib/utils";
import { useModal } from "~/hooks/useStore";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import SimpleBar from "simplebar-react";

enum TabName {
  UserAccount = "user_account",
  UserApiKeys = "user_api_keys",
  UserSettings = "user_settings",
}

const options = [
  {
    title: "Account",
    name: TabName.UserAccount,
    defaultIcon: DefaultUserAccountIcon,
    activeIcon: ActiveUserAccountIcon,
  },
  {
    title: "API Keys",
    name: TabName.UserApiKeys,
    defaultIcon: DefaultUserApiKeysIcon,
    activeIcon: ActiveUserApiKeysIcon,
  },
  {
    title: "Settings",
    name: TabName.UserSettings,
    defaultIcon: DefaultUserSettingsIcon,
    activeIcon: ActiveUserSettingsIcon,
  },
];

const UserProfileModal = () => {
  const { t } = useTranslation();
  const { isUserProfileModalOpen, toggleUserProfileModal } = useModal();
  const [active, setActive] = React.useState(TabName.UserAccount);

  return (
    <>
      <Dialog
        open={isUserProfileModalOpen}
        onOpenChange={toggleUserProfileModal}
      >
        <DialogContent className="h-[30rem] max-w-screen-sm rounded-xl p-6 py-8 sm:p-8 sm:py-12">
          <div className="flex gap-6 sm:gap-16">
            <div className="flex shrink-0 select-none flex-col gap-8">
              {options.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setActive(item.name)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-4 py-2 text-muted-foreground sm:px-6 sm:py-2",
                    {
                      "rounded-full bg-foreground text-background duration-300":
                        active === item.name,
                    },
                  )}
                >
                  {active === item.name ? (
                    <item.activeIcon className="h-6 w-6 sm:h-5 sm:w-5" />
                  ) : (
                    <item.defaultIcon className="h-6 w-6 sm:h-5 sm:w-5" />
                  )}
                  <div
                    className={cn(
                      "hidden text-sm sm:block",
                      active === item.name ? "font-bold" : "",
                    )}
                  >
                    {t(item.title)}
                  </div>
                </div>
              ))}
            </div>

            <SimpleBar autoHide={true} className="max-h-[24rem] w-3/4">
              <div className="px-1">
                {active === TabName.UserAccount && <UserAccount />}
                {active === TabName.UserApiKeys && <UserApiKeys />}
                {active === TabName.UserSettings && <UserSettings />}
              </div>
            </SimpleBar>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileModal;

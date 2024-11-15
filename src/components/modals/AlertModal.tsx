"use client";

import { Button, Modal, message } from "antd";
import { useTranslation } from "react-i18next";

export default function AlertModal({
  deleteModalOpen,
  onDeleteModalOpen,
  onDeleteItem,
  itemId,
}: {
  deleteModalOpen: boolean;
  onDeleteModalOpen: (value: boolean) => void;
  onDeleteItem: (key: string) => void;
  itemId: string | null;
}) {
  const { t } = useTranslation();

  return (
    <Modal
      title={t("Are you sure you want to delete?")}
      centered
      width={380}
      open={deleteModalOpen}
      onOk={() => onDeleteModalOpen(false)}
      onCancel={() => onDeleteModalOpen(false)}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            onDeleteModalOpen(false);
            message.info("Cancelled");
          }}
        >
          {t("Cancel")}
        </Button>,
        <Button
          key="confirm"
          className="bg-blue-600 text-white hover:!border-blue-600 hover:!bg-blue-600 hover:!text-white"
          onClick={() => {
            if (itemId !== null) {
              onDeleteItem(itemId);
            }
            onDeleteModalOpen(false);
          }}
        >
          {t("Confirm")}
        </Button>,
      ]}
    >
      <p className="my-8">
        {t(
          "This action is irreversible and will permanently delete the data from the database.",
        )}
      </p>
    </Modal>
  );
}

"use client";

import { Modal } from "antd";
import React from "react";

export default function TableModal({
  children,
  title,
  modalOpen,
  changeModalOpen,
}: {
  children: React.ReactNode;
  title: string;
  modalOpen: boolean;
  changeModalOpen: (open: boolean) => void;
}) {
  return (
    <Modal
      title={title}
      open={modalOpen}
      zIndex={10}
      onOk={() => changeModalOpen(false)}
      onCancel={() => changeModalOpen(false)}
      width={"80%"}
      footer={null}
    >
      {children}
    </Modal>
  );
}

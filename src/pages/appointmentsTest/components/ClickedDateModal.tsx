import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";

interface ClickedDateModalProps {
  isVisible: boolean;
  onCancel: () => void;
  clickedDate: Date | null;
}

const ClickedDateModal: React.FC<ClickedDateModalProps> = ({
  isVisible,
  onCancel,
  clickedDate,
}) => {
  return (
    <Modal title="Fecha Seleccionada" open={isVisible} onCancel={onCancel}>
      <p>Fecha Seleccionada: {clickedDate && dayjs(clickedDate).format("MMMM D, YYYY")}</p>
    </Modal>
  );
};

export default ClickedDateModal;

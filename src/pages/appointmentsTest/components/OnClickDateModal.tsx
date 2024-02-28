import React from "react";
import { Modal } from "antd";
import dayjs from "dayjs";
import Strings from "../../../utils/Strings";

interface OnClickDateModalProps {
  isVisible: boolean;
  onCancel: () => void;
  clickedDate: Date | null;
}

const OnClickDateModal: React.FC<OnClickDateModalProps> = ({
  isVisible,
  onCancel,
  clickedDate,
}) => {
  return (
    <Modal title={Strings.selectedDate} open={isVisible} onCancel={onCancel}>
      <p> {Strings.selectedDate}{clickedDate && dayjs(clickedDate).format("MMMM D, YYYY")}</p>
    </Modal>
  );
};

export default OnClickDateModal;

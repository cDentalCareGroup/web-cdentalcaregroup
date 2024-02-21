import React from "react";
import { Modal } from "antd";
import Strings from "../../../utils/Strings";

interface SelectedEventModalProps {
  isVisible: boolean;
  onCancel: () => void;
  selectedEvent: any;
}

const SelectedEventModal: React.FC<SelectedEventModalProps> = ({
  isVisible,
  onCancel,
  selectedEvent,
}) => {
  return (
    <Modal title={Strings.detailsEvent} open={isVisible} onCancel={onCancel}>
      {selectedEvent && <p>{Strings.selectedEvent} {selectedEvent.title}</p>}
      
    </Modal>
  );
};

export default SelectedEventModal;

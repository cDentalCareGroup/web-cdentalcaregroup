import React from "react";
import { Modal } from "antd";

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
    <Modal title="Detalles del Evento" open={isVisible} onCancel={onCancel}>
      {selectedEvent && <p>Evento Seleccionado: {selectedEvent.title}</p>}
      
    </Modal>
  );
};

export default SelectedEventModal;

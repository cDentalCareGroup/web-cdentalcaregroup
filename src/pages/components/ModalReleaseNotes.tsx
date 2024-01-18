import { Collapse, Modal, Typography } from "antd";
import Strings from "../../utils/Strings";
import { useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";

const ModalReleaseNotes = () => {
  const [open, setOpen] = useState(false);

  const buildAppVersion = (): string => {
    return `${import.meta.env.VITE_APP_VERSION} - ${
      import.meta.env.VITE_APP_VERSION.VITE_ENV_NAME
    }`;
  };

  return (
    <div>
      <div
        className="flex w-full items-end justify-end cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="mr-2 mb-1 text-xs text-gray-600">
          {buildAppVersion()}
        </span>
      </div>
      <Modal
        title="CDental Care Web"
        okText={Strings.accept}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        <div className="flex flex-col mt-2 mb-4 p-4">
          <Collapse
            bordered={false}
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) =>
              isActive ? <RiArrowDownSLine /> : <RiArrowRightSLine />
            }
          >
            <Collapse.Panel header={`Versión: ${buildAppVersion()}`} key="1">
              <Typography.Paragraph>
                ◉ Ahora en las citas, veras la lista de doctores en la parte
                superior, al dar click unicamente se mostraran las citas de ese
                doctor asignado, presiona "Todas" para limpiar todos los filtros
                que hayas realizado
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Cada doctor tendra un color distintivo, ademas de que la Card
                de cada cita contara con los colores para que puedas
                identificarla rapidamente
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Ahora al agendar cualquier tipo de cita podras elegir si
                bloquear el calendario publico o no, es decir se deshabilitara
                la hora y fecha para ese dia en el calendario publico si
                seleccionas esa opcion, caso contrario, no se vera afectado el
                calendario publico
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Ahora puedes habilitar o deshabilitar el envio de mensajes por
                whatsapp en las citas
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Las Card de la cita ahora cuentan con un boton "Información
                del paciente" el cual te llevara al detalle del paciente, su
                información, su pad, su estado de cuenta y su historial clinico
                de citas
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Las Card de la cita ahora cuentan con un boton "Información
                del la cita" el cual te llevara al detalle de la cita desglozado
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ El buscador de citas NO aplica filtros por fecha, es decir
                cuando buscas a un paciente te listara TODAS sus citas sin
                filtro
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Mejoras en el diseño de la interfaz
              </Typography.Paragraph>
              <Typography.Paragraph>
                ◉ Mejoras en el rendimiento de la aplicación
              </Typography.Paragraph>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Modal>
    </div>
  );
};

export default ModalReleaseNotes;

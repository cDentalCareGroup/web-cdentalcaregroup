import Card from "antd/es/card/Card";
import SectionElement from "../components/SectionElement";
import { RiCalendar2Line, RiInformationLine, RiMailLine, RiMentalHealthLine, RiPhoneLine, RiStethoscopeLine, RiTimeLine, RiUser3Line } from "react-icons/ri";
import { getDentist, getPatientEmail, getPatientName, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { Button, Row, Space, Tag } from "antd";
import { useGetEmployeesByTypeMutation } from "../../services/employeeService";
import { GetEmployeeByTypeRequest } from "../../data/employee/employee.request";
import { useState } from "react";
import SelectItemOption from "../../data/select/select.item.option";
import { employeesToSelectItemOptions } from "../../data/employee/employee.extentions";
import Modal from "antd/es/modal/Modal";
import Strings from "../../utils/Strings";
import SelectSearch from "../components/SelectSearch";
import { useGetPatientsMutation } from "../../services/patientService";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { useRegisterDentistToAppointmentMutation } from "../../services/appointmentService";
import { RegisterAppointmentDentistRequest } from "../../data/appointment/appointment.request";
import { useAppSelector } from "../../core/store";
import { selectCurrentUser } from "../../core/authReducer";

interface AppointmentCardProps {
    appointment: AppointmentDetail,
}


const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
    const [data, setData] = useState(appointment);
    const [getEmployeesByType] = useGetEmployeesByTypeMutation();
    const [getPatients] = useGetPatientsMutation();
    const [registerDentistToAppointment] = useRegisterDentistToAppointmentMutation();

    const [dentistList, setDentistList] = useState<SelectItemOption[]>([]);
    const [dentist, setDentist] = useState<SelectItemOption | undefined>();
    const [modalDentist, setModalDentist] = useState(false);

    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [isActionLoading,setIsActionLoading] = useState(false);
    const [patient, setPatient] = useState<SelectItemOption | undefined>();

    const user = useAppSelector(selectCurrentUser);

    const getStautsTag = (): JSX.Element => {
        if (data.appointment.status == 'activa') {
            return <Tag color="success">{data.appointment.status}</Tag>
        }
        return <></>;
    }

    const handleOnSetDentist = async () => {
        await handleGetPatients();
        await handleGetDentist();
        setModalDentist(true);
    }

    const handleOnSaveDentist = async () => {
        // if (dentist == null || dentist.id == 0 || patient == null) {
        //     handleErrorAlert(SnackBarMessageType.FIELDS_REQUIRED);
        //     return
        // }
        try {
            setIsActionLoading(true);
            const response = await registerDentistToAppointment(
                new RegisterAppointmentDentistRequest(
                    dentist?.id ?? 0,
                    appointment?.appointment.id ?? 0,
                    user.username,
                    patient?.id.toString() ?? ''
                )
            ).unwrap();
            setData(response);
            resetSetDentistParams();
          //  handleSuccessAlert();
        } catch (error) {
            console.log(error);
           
        }
    }
    const resetSetDentistParams = () => {
        setDentist(undefined);
        setPatient(undefined);
    }

    const handleGetDentist = async () => {
        try {
            const response = await getEmployeesByType(
                new GetEmployeeByTypeRequest('Medico/Especialista')
            ).unwrap();
            setDentistList(employeesToSelectItemOptions(response, true));
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetPatients = async () => {
        try {
            const response = await getPatients(
                new FilterEmployeesRequest(DEFAULT_PATIENTS_ACTIVE)
            ).unwrap();
            const filtered = response.filter((value, _) => value.originBranchOfficeId == 10)
            setPatientList(patientsToSelectItemOption(filtered));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Card title={getPatientName(data)}>
                <SectionElement label="Fecha y hora" value={`${data.appointment.appointment} ${data.appointment.time}`} icon={<RiCalendar2Line />} />
                <SectionElement label="Sucursal" value={data.branchOffice.name} icon={<RiMentalHealthLine />} />
                <SectionElement label="Correo electrónico" value={getPatientEmail(data)} icon={<RiMailLine />} />
                <SectionElement label="Teléfono" value={getPatientPrimaryContact(data)} icon={<RiPhoneLine />} />
                <SectionElement label="Dentista" value={getDentist(data)} icon={<RiMentalHealthLine />} />
                {getStautsTag()}

                <Row className="mt-2">
                    {!data.dentist && <Button type="default" onClick={() => handleOnSetDentist()} >Asignar dentista</Button>}
                </Row>
            </Card>



            <Modal title={'Asignar dentista'} okText={'Guardar'} confirmLoading={isActionLoading} open={modalDentist} onOk={() => handleOnSaveDentist()} onCancel={() => setModalDentist(false)}>
                <br />
                <SelectSearch placeholder="Selecciona un paciente" items={patientList} onChange={(value) => setPatient(value)} icon={<RiUser3Line />} />
                <div className="flex w-full items-end justify-end my-2">
                    <Button type="link" size="small" onClick={() => handleGetPatients()}>Actualizar pacientes</Button>
                </div>
                <br />
                <SelectSearch placeholder="Selecciona un dentista" items={dentistList} onChange={(value) =>  setDentist(value)} icon={<RiMentalHealthLine />} />

            </Modal>
        </>
    );
}

export default AppointmentCard;
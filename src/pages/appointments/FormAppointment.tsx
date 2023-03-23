import { Button, Checkbox, Modal, Tag } from "antd";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiHospitalLine, RiMentalHealthLine, RiUser2Fill, RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { GetAppointmentAvailabilityRequest, RegisterCallCenterAppointmentRequest } from "../../data/appointment/appointment.request";
import { AvailableTime } from "../../data/appointment/available.time";
import { availableTimesToTimes } from "../../data/appointment/available.times.extensions";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { Patient } from "../../data/patient/patient";
import { buildPatientEmail, buildPatientName, buildPatientPhone } from "../../data/patient/patient.extensions";
import { Prospect } from "../../data/prospect/prospect";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem, patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { useGetAppointmentAvailabilityMutation, useRegisterCallCenterAppointmentMutation } from "../../services/appointmentService";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetPatientsMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { dayName, monthName, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import Calendar from "../components/Calendar";
import CustomFormInput from "../components/CustomFormInput";
import SectionElement from "../components/SectionElement";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";
import ScheduleAppointmentInfoCard from "./components/ScheduleAppointmentInfoCard";
import {
    WhatsAppOutlined,
} from '@ant-design/icons';
interface FormAppointmentProps {
    patient?: Patient;
    prospect?: Prospect;
    callId?: number;
    onFinish?: () => void;
    rol: UserRoles;
    title?: string;
}

const FormAppointment = (props: FormAppointmentProps) => {
    const [getBranchOffices] = useGetBranchOfficesMutation();
    const [branchOffices, setBranchOffices] = useState<SelectItemOption[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [branchOffice, setBranchOffice] = useState<SelectItemOption>();
    const [getAppointmentAvailability, { isLoading }] = useGetAppointmentAvailabilityMutation();
    const [date, setDate] = useState(new Date());
    const [times, setTimes] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
    const [time, setTime] = useState<string>();
    const [getPatients] = useGetPatientsMutation();
    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [patient, setPatient] = useState<SelectItemOption>();
    const [isProspect, setIsProspect] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [registerCallCenterAppointment] = useRegisterCallCenterAppointmentMutation();
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const [notify, setNotify] = useState(true);
    useEffect(() => {
        handleGetBranchOffices();
    }, []);

    const handleGetPatients = async (branchId: Number) => {
        try {
            const response = await getPatients(
                new FilterEmployeesRequest(DEFAULT_PATIENTS_ACTIVE)
            ).unwrap();
            setPatientList(patientsToSelectItemOption(response.filter((value, _) => value.originBranchOfficeId == branchId)));
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            if (props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) {
                setBranchOffices(branchOfficesToSelectOptionItem(response));
            } else {
                setBranchOffices(branchOfficesToSelectOptionItem(response.filter((value, _) => value.id == branchId)));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOnBranchOffice = async (event: SelectItemOption) => {
        setBranchOffice(event);
        handleGetAppointmentAvailability(date, event.label);
        if (props.patient == null || props.patient == undefined || props.prospect == null || props.prospect == undefined) {
            handleGetPatients(event.id);
        }
    }

    const handleGetAppointmentAvailability = async (date: Date, branchOffice: string) => {
        try {
            const response = await getAppointmentAvailability(
                new GetAppointmentAvailabilityRequest(branchOffice.split('-')[0], dayName(date), date, true)).unwrap();
            setTimes(availableTimesToTimes(response));
            setDate(date);
            setAvailableTimes(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnDate = async (inCommingDate: Date) => {
        handleGetAppointmentAvailability(inCommingDate, branchOffice?.label ?? '');
    }

    const getTime = () => {
        return time?.split(" ")[0];
    }

    const handleResetParams = () => {
        setTime('');
        setName('');
        setPhone('');
        setEmail('');
        setDate(new Date());
        setBranchOffice(undefined);
        setIsProspect(false);
        setPatient(undefined);
        setIsActionLoading(false);
        setIsOpen(false);
    }

    const handleOnRegisterAppointment = async () => {
        try {
            setIsActionLoading(true);
            const dateTime = availableTimes.find((value, _) => value.time == time);

            let finalPatientId = 0;

            if (props.patient != null && props.patient != undefined) {
                finalPatientId = props.patient.id;
            } else {
                finalPatientId = patient?.id ?? 0;
            }
            await registerCallCenterAppointment(
                new RegisterCallCenterAppointmentRequest(
                    name,
                    phone,
                    date,
                    dateTime,
                    email,
                    branchOffice?.id,
                    finalPatientId,
                    props?.prospect?.id ?? 0, props.callId ?? 0, notify
                )
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER_APPOINTMENT);
            handleResetParams();
            if (props.onFinish != null && props.onFinish != undefined) {
                props.onFinish();
            }
        } catch (error) {
            console.log(error);
            setIsActionLoading(false);
            handleErrorNotification(error);
        }
    }

    const buildTitle = (): string => {
        if (props.title != null && props.title != undefined && props.title != '') {
            return props.title;
        } else {
            return Strings.scheduleNewAppointment
        }
    }
    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <div className="flex flex-col items-end justify-end">
                        <Button type="primary" onClick={() => setIsOpen(true)}>Registrar cita</Button>
                    </div>
                    <Modal confirmLoading={isActionLoading} okText={Strings.save} onOk={() => handleOnRegisterAppointment()} width={'85%'} open={isOpen} onCancel={() => handleResetParams()} title={buildTitle()}>
                        <SelectSearch
                            placeholder={Strings.selectBranchOffice}
                            items={branchOffices}
                            onChange={handleOnBranchOffice}
                            icon={<RiMentalHealthLine />}
                        />
                        {branchOffice != null && <Calendar validateTime={true} availableHours={times} handleOnSelectDate={handleOnDate} isLoading={isLoading} handleOnSelectTime={(value) => setTime(value)} />}

                        <br />
                        {(time != '' && isProspect == false && branchOffice != null && props.patient == null && props.prospect == null) && <SelectSearch
                            placeholder={Strings.selectPatient}
                            items={patientList}
                            onChange={(value) => setPatient(value)}
                            icon={<RiUser3Line />}
                        />}

                        {isProspect &&
                            <div className="flex flex-col">
                                <CustomFormInput label={Strings.patientName} value={name} onChange={(value) => setName(value)} />
                                <CustomFormInput label={Strings.phoneNumber} value={phone} onChange={(value) => setPhone(value)} />
                                <CustomFormInput label={Strings.email} value={email} onChange={(value) => setEmail(value)} />
                            </div>}

                        {((time != '' && time != null) && (props.prospect == null)) &&
                            <div className="flex flex-col items-end justify-end">
                                <Button onClick={() => setIsProspect(!isProspect)} type="link">
                                    {isProspect ? Strings.selectPatient : Strings.registerProspect}
                                </Button>
                            </div>
                        }

                        {(isProspect && name != null && phone != null && time != '') &&
                            <ScheduleAppointmentInfoCard
                                name={name ?? ''}
                                primaryContact={phone ?? ''}
                                email={email ?? ''}
                                date={date}
                                time={time}
                                branchOfficeName={branchOffice?.label.split('-')[0] ?? ''} />
                        }
                        {(props.patient != null && props.patient != undefined && time != '' && branchOffice != null) &&
                            <ScheduleAppointmentInfoCard
                                name={buildPatientName(props.patient)}
                                primaryContact={buildPatientPhone(props.patient)}
                                email={buildPatientEmail(props.patient)}
                                date={date}
                                time={time}
                                branchOfficeName={branchOffice?.label.split('-')[0] ?? ''} />
                        }
                        {(props.prospect != null && props.prospect != undefined && time != '' && branchOffice != null) &&
                            <ScheduleAppointmentInfoCard
                                name={props.prospect.name}
                                primaryContact={props.prospect.primaryContact}
                                email={props.prospect.email ?? '-'}
                                date={date}
                                time={time}
                                branchOfficeName={branchOffice?.label.split('-')[0] ?? ''} />
                        }
                        {!isProspect && time != '' && patient &&
                            <div className="flex transition-all flex-col bg-gray-50 rounded-md p-2 text-gray-500">
                                <span className="text-gray-700 text-2xl font-semibold flex">{Strings.appointmentSummary}</span>
                                <SectionElement label={Strings.patientName} value={`${patient?.label}`} icon={<RiMentalHealthLine />} />
                                <SectionElement label={Strings.dateAndTime}
                                    value={`${dayName(date)} ${date.getDate()} ${monthName(date)} ${date.getFullYear()}, ${getTime()}`}
                                    icon={<RiCalendar2Line />} />
                                <SectionElement label={Strings.branchOffice} value={`${branchOffice?.label}`} icon={<RiHospitalLine />} />

                            </div>}
                        {(time != '' && time != null) && (patient != null || props.prospect != null || phone != '' || props.patient != null) && <div className="flex w-full mt-2">
                            <div className="flex flex-row">
                                <Tag className="cursor-pointer" icon={<WhatsAppOutlined />} color="#25D366">
                                    Notificar por whastapp
                                </Tag>
                                <Checkbox value={notify} checked={notify} onChange={(event) => setNotify(event.target.checked)} />
                            </div>
                        </div>}
                    </Modal>
                </div>
            } />
    );
}

export default FormAppointment;
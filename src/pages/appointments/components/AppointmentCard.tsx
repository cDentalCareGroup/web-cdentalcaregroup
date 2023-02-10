import Card from "antd/es/card/Card";
import SectionElement from "../../components/SectionElement";
import { RiCalendar2Line, RiHashtag, RiHospitalLine, RiMailLine, RiMentalHealthLine, RiMoneyDollarCircleLine, RiPhoneLine, RiServiceLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { getDentist, getPatientEmail, getPatientName, getPatientPad, getPatientPrimaryContact } from "../../../data/patient/patient.extensions";
import { AppointmentDetail } from "../../../data/appointment/appointment.detail";
import { Button, Form, Input, Radio, Row, Select, Tag } from "antd";
import { useGetEmployeesByTypeMutation } from "../../../services/employeeService";
import { GetEmployeeByTypeRequest } from "../../../data/employee/employee.request";
import { useEffect, useRef, useState } from "react";
import SelectItemOption from "../../../data/select/select.item.option";
import { employeesToSelectItemOptions } from "../../../data/employee/employee.extentions";
import Modal from "antd/es/modal/Modal";
import SelectSearch from "../../components/SelectSearch";
import { useGetPatientsMutation } from "../../../services/patientService";
import { FilterEmployeesRequest } from "../../../data/filter/filters.request";
import { DEFAULT_PATIENTS_ACTIVE } from "../../../data/filter/filters";
import { appointmentToBranchOfficeSelectItemOption, appointmentToDentistSelectItemOption, appointmentToPatientSelectItemOption, branchOfficesToSelectOptionItem, patientsToSelectItemOption, timesToSelectItemOption } from "../../../data/select/select.item.option.extensions";
import { useExtendAppointmentMutation, useGetAppointmentAvailabilityMutation, useGetDentistAvailabilityMutation, useGetPaymentMethodsMutation, useGetServicesMutation, useRegisterDentistToAppointmentMutation, useRegisterNextAppointmentMutation, useRescheduleAppointmentMutation, useUpdateAppointmentStatusMutation, useUpdateHasCabinetAppointmentMutation, useUpdateHasLabsAppointmentMutation } from "../../../services/appointmentService";
import { AppointmentAvailbilityByDentistRequest, ExtendAppointmentRequest, GetAppointmentAvailabilityRequest, RegisterAppointmentDentistRequest, RegisterNextAppointmentRequest, RescheduleAppointmentRequest, UpdateAppointmentStatusRequest, UpdateHasCabinetAppointmentRequest, UpdateHasLabsAppointmentRequest } from "../../../data/appointment/appointment.request";
import { useAppSelector } from "../../../core/store";
import { selectCurrentUser } from "../../../core/authReducer";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../../utils/Notifications";
import { dayName, isAdmin, stringToDate } from "../../../utils/Extensions";
import Calendar from "../../components/Calendar";
import { AvailableTime } from "../../../data/appointment/available.time";
import { availableTimesToTimes } from "../../../data/appointment/available.times.extensions";
import { useGetBranchOfficesMutation } from "../../../services/branchOfficeService";
import ScheduleAppointmentInfoCard from "./ScheduleAppointmentInfoCard";
import { format, isToday, parseISO } from "date-fns";
import Checkbox from "antd/es/checkbox/Checkbox";
import useSessionStorage from "../../../core/sessionStorage";
import Constants from "../../../utils/Constants";
import { useNavigate } from "react-router-dom";
import Strings from "../../../utils/Strings";
import { extendedTimesToShow, filterExtendedAvailableTimes, getAppointmentStatus } from "../../../data/appointment/appointment.extensions";
import { Employee } from "../../../data/employee/employee";
import { PaymentMethod } from "../../../data/payment/payment.method";
import { servicesToSelectItemOption } from "../../../data/service/service.extentions";
import RegisterCall from "../../callcenter/RegisterCall";
import MultiSelectSearch from "../../components/MultiSelectSearch";

interface AppointmentCardProps {
    appointment: AppointmentDetail,
    onStatusChange: (status: string) => void;
    onAppointmentChange?: (appointment: AppointmentDetail) => void;
    hideContent: boolean;
}


const AppointmentCard = ({ appointment, onStatusChange, hideContent, onAppointmentChange }: AppointmentCardProps) => {
    const [data, setData] = useState(appointment);
    const [getEmployeesByType] = useGetEmployeesByTypeMutation();
    const [getPatients] = useGetPatientsMutation();
    const [registerDentistToAppointment] = useRegisterDentistToAppointmentMutation();
    const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
    const [getAppointmentAvailability] = useGetAppointmentAvailabilityMutation();
    const [getBranchOffices] = useGetBranchOfficesMutation();
    const [rescheduleAppointment] = useRescheduleAppointmentMutation();
    const [getDentistAvailability] = useGetDentistAvailabilityMutation();
    const [registerNextAppointment] = useRegisterNextAppointmentMutation();
    const [updateHasLabsAppointment] = useUpdateHasLabsAppointmentMutation();
    const [updateHasCabinetAppointment] = useUpdateHasCabinetAppointmentMutation();
    const [getPaymentMethods] = useGetPaymentMethodsMutation();
    const [getServices] = useGetServicesMutation();
    const [extendAppointment] = useExtendAppointmentMutation();

    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
    const [paymentMethodId, setPaymentMethodId] = useState(0);

    const [serviceList, setServiceList] = useState<SelectItemOption[]>([]);
    const [services, setServices] = useState<number[]>();


    const [dentistList, setDentistList] = useState<SelectItemOption[]>([]);
    const [dentist, setDentist] = useState<SelectItemOption | undefined>();
    const [modalDentist, setModalDentist] = useState(false);

    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [patient, setPatient] = useState<SelectItemOption | undefined>();

    const [modalReschedule, setModalReschedule] = useState(false);
    const [branchOffice, setBranchOffice] = useState<SelectItemOption | undefined>();
    const [date, setDate] = useState<Date>(new Date());
    const [times, setTimes] = useState<string[]>([]);
    const [time, setTime] = useState<string | null>();
    const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
    const [isCalendarLoading, setIsCalendarLoading] = useState(false);
    const [branchOfficeList, setBranchOfficeList] = useState<SelectItemOption[]>([]);

    const [modalNextAppointment, setModalNextAppointment] = useState(false);
    const scrollRef = useRef<any>(null);
    const [hasLabs, setHasLabs] = useState(0);
    const [hasCabinet, setHasCabinet] = useState(0);

    const [modalExtendAppointment, setModalExtendAppointment] = useState(false);
    const [extendedTimesList, setExtendedTimesList] = useState<SelectItemOption[]>([]);
    const [extendedAvailableTimes, setExtendedAvailableTimes] = useState<number[]>([]);
    const [isExtendTimesLoading, setIsExtendTimesLoading] = useState(false);

    const user = useAppSelector(selectCurrentUser);
    const navigate = useNavigate();
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );

    const [modalFinish, setModalFinish] = useState(false);
    const [amount, setAmount] = useState('');

    const getStautsTag = (): JSX.Element => {
        if (data.appointment.status == 'activa') {
            return <Tag color="success">{getAppointmentStatus(data)}</Tag>
        }
        if (data.appointment.status == 'proceso') {
            return <Tag color="blue">{getAppointmentStatus(data)}</Tag>
        }
        if (data.appointment.status == 'finalizada') {
            return <Tag color="default">{getAppointmentStatus(data)}</Tag>
        }
        if (data.appointment.status == 'no-atendida') {
            return <Tag color="red">{getAppointmentStatus(data)}</Tag>
        }
        return <></>;
    }

    const handleOnSetDentist = async () => {
        await handleGetDentist();
        if (data.dentist != null && data.dentist != undefined) {
            const dentist = appointmentToDentistSelectItemOption(data);
            setDentist(dentist);
        }
        await handleGetPatients();
        if (data.patient != null && data.patient != undefined) {
            const defaultPatient = appointmentToPatientSelectItemOption(data);
            setPatient(defaultPatient);
        }
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
            handleSucccessNotification(NotificationSuccess.UPDATE);
            onAppointmentChange?.(response);
        } catch (error) {
            resetSetDentistParams();
            handleErrorNotification(error);
        }
    }
    const resetSetDentistParams = () => {
        setDentist(undefined);
        setPatient(undefined);
        setIsActionLoading(false);
        setModalDentist(false);
    }

    const handleGetDentist = async () => {
        try {
            const response = await getEmployeesByType(
                new GetEmployeeByTypeRequest('Medico/Especialista')
            ).unwrap();
            if (isAdmin(user)) {
                setDentistList(employeesToSelectItemOptions(response, true));
            } else {
                setDentistList(filterDentist(response));
            }

        } catch (error) {
            console.log(error);
        }
    }

    const filterDentist = (data: Employee[]): SelectItemOption[] => {
        const specialist = data.filter((value, _) => value.typeName == Constants.EMPLOYEE_SPECIALIST);
        const dentist = data.filter((value, _) => value.typeName == Constants.EMPLOYEE_MEDICAL && value.branchOfficeId == Number(branchId));
        return employeesToSelectItemOptions(specialist.concat(dentist), true);
    }

    const handleGetPatients = async () => {
        try {
            const response = await getPatients(
                new FilterEmployeesRequest(DEFAULT_PATIENTS_ACTIVE)
            ).unwrap();
            const filtered = response.filter((value, _) => value.originBranchOfficeId == Number(branchId))
            setPatientList(patientsToSelectItemOption(filtered));
        } catch (error) {
            console.log(error);
        }
    }

    const isValidDentist = (): boolean => {
        return data.dentist != null &&
            (data.appointment.startedAt == null || data.appointment.startedAt == "")
            && data.appointment.status != 'no-atendida'
    }
    const canReschedule = (): boolean => {
        return data.appointment.status == 'activa' || data.appointment.status == 'no-atendida'
    }

    const handleUpdateAppointmentStatus = async (status: string) => {
        try {
            if (status == 'finalizada') {
                if (paymentMethodId == 0 || paymentMethodId == undefined) {
                    handleErrorNotification(Constants.EMPTY_PAYMENT_METHOD);
                    return;
                }
                if (amount == '' || amount == undefined) {
                    handleErrorNotification(Constants.EMPTY_COST);
                    return;
                }
                if (services?.length == null || services.length == 0) {
                    handleErrorNotification(Constants.EMPTY_SERVICE);
                    return;
                }
            }
            setIsActionLoading(true);
            const response = await updateAppointmentStatus(
                new UpdateAppointmentStatusRequest(
                    data.appointment.id,
                    status,
                    amount,
                    paymentMethodId,
                    services ?? []
                )).unwrap();
            setData(response);
            onStatusChange(status);
            setIsActionLoading(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
            onAppointmentChange?.(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    const canFinish = (): boolean => {
        return data.appointment.status == 'proceso'
    }

    const canExtendAppointment = (): boolean => {
        return data.appointment.status == 'proceso' ||
            data.appointment.status == 'activa'
    }

    const handleGetAppointmentAvailability = async (date: Date, branchOffice: string) => {
        try {
            setIsCalendarLoading(true);
            const response = await getAppointmentAvailability(
                new GetAppointmentAvailabilityRequest(branchOffice.split("-")[0], dayName(date), date)
            ).unwrap();
            setTimes(availableTimesToTimes(response));
            setDate(date);
            setAvailableTimes(response);
            setIsCalendarLoading(false);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnReschedueAppointment = async () => {
        const branchOfficeOption = appointmentToBranchOfficeSelectItemOption(data);
        setBranchOffice(branchOfficeOption);
        if (isAdmin(user)) {
            await handleGetBranchOffices();
        } else {
            if (branchOfficeOption != null) setBranchOfficeList([branchOfficeOption]);
        }
        await handleGetAppointmentAvailability(date, branchOfficeOption?.label ?? '');
        setModalReschedule(true);
    }

    const handleOnSelectDate = (calendarDate: Date) => {
        handleGetAppointmentAvailability(calendarDate, branchOffice?.label ?? '');
        setTime(null);
    }

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setBranchOfficeList(branchOfficesToSelectOptionItem(response));
        } catch (error) {
            console.log(error);
        }
    }

    const resetRescheduleAppointmentParams = () => {
        setDate(new Date());
        setTime(null);
        setBranchOffice(undefined);
        setTimes([]);
        setAvailableTimes([]);
        setIsActionLoading(false);
    }

    const handleOnBranchOfficeChange = (event: SelectItemOption) => {
        resetRescheduleAppointmentParams();
        setBranchOffice(event);
        handleGetAppointmentAvailability(date, event.label);
    }

    const handleOnRescheduleAppointment = async () => {
        try {
            setIsActionLoading(true);
            const dateTime = availableTimes.find((value, _) => value.time == time);
            const response = await rescheduleAppointment(
                new RescheduleAppointmentRequest(
                    data?.appointment.id,
                    date,
                    dateTime,
                    branchOffice?.label
                )
            ).unwrap();
            setData(response);
            setModalReschedule(false);
            resetRescheduleAppointmentParams();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            onAppointmentChange?.(response);
            onStatusChange?.('activa');
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleOnNextAppointment = async () => {
        const branchOfficeOption = appointmentToBranchOfficeSelectItemOption(data);
        setBranchOffice(branchOfficeOption);
        const dentist = appointmentToDentistSelectItemOption(data);
        setDentist(dentist);
        if (isAdmin(user)) {
            await handleGetBranchOffices();
        } else {
            if (branchOfficeOption != null) setBranchOfficeList([branchOfficeOption]);
        }
        await handleGetDentist();
        handleGetDentistAvailability(
            dentist.id,
            branchOfficeOption?.id ?? 0,
            date
        );
        setModalNextAppointment(true);
        await handleGetServices();
    }

    const handleGetDentistAvailability = async (
        dentistId: Number, branchOfficeId: Number,
        filterDate: Date
    ) => {
        try {
            setTimes([]);
            setAvailableTimes([]);
            setIsCalendarLoading(true);
            const response = await getDentistAvailability(
                new AppointmentAvailbilityByDentistRequest(
                    dentistId.toString(),
                    dayName(filterDate),
                    branchOfficeId.toString(),
                    format(filterDate, 'yyyy-M-dd'))
            ).unwrap();
            setTimes(availableTimesToTimes(response));
            setAvailableTimes(response);
            setIsCalendarLoading(false);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnBranchOfficeDentistChange = (event: SelectItemOption, isOffice: boolean) => {
        setTime(null);
        if (isOffice) {
            setBranchOffice(event);
            handleGetDentistAvailability(
                dentist?.id ?? 0,
                event.id,
                date
            )
        } else {
            setDentist(event);
            if (event.description == Constants.EMPLOYEE_SPECIALIST) {
                handleGetAppointmentAvailability(date, branchOffice?.label ?? '');
            } else {
                handleGetDentistAvailability(
                    event.id,
                    branchOffice?.id ?? 0,
                    date
                )
            }

        }
    }

    const handleOnCalendarDentistChange = (newDate: Date) => {
        setTime(null);
        setDate(newDate);
        if (dentist?.description == Constants.EMPLOYEE_SPECIALIST) {
            handleGetAppointmentAvailability(newDate, branchOffice?.label ?? '');
        } else {
            handleGetDentistAvailability(
                dentist?.id ?? 0,
                branchOffice?.id ?? 0,
                newDate
            )
        }
    }


    const handleOnRegisterNextAppointment = async () => {
        try {
            if (services?.length == null || services.length == 0) {
                handleErrorNotification(Constants.EMPTY_SERVICE);
                return;
            }
            setIsActionLoading(true);
            const dateTime = availableTimes.find((value, _) => value.time == time);
            const response = await registerNextAppointment(
                new RegisterNextAppointmentRequest(
                    appointment?.patient?.id ?? 0,
                    branchOffice?.id.toString() ?? '0',
                    dentist?.id.toString() ?? '0',
                    hasLabs,
                    hasCabinet,
                    services ?? [],
                    appointment.appointment.id ?? 0,
                    date,
                    dateTime,
                )
            ).unwrap();
            setData(response);
            resetNextAppointmentParams();
            handleSucccessNotification(NotificationSuccess.REGISTER_APPOINTMENT);
            onStatusChange('finalizada-cita');
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }

    const resetNextAppointmentParams = () => {
        setDentist(undefined);
        setBranchOffice(undefined);
        setDate(new Date());
        setTime(null);
        setAvailableTimes([]);
        setTimes([]);
        setIsActionLoading(false);
        setModalNextAppointment(false);
    }

    const handleOnHasLabs = async (value: number) => {
        setHasLabs(value);
        try {
            const response = await updateHasLabsAppointment(
                new UpdateHasLabsAppointmentRequest(
                    data.appointment.id,
                    value
                )
            ).unwrap();
            setData(response);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnHasCabinet = async (value: any) => {
        setHasCabinet(value);
        try {
            const response = await updateHasCabinetAppointment(
                new UpdateHasCabinetAppointmentRequest(
                    data.appointment.id,
                    value
                )
            ).unwrap();
            setData(response);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const buildServices = (): string | JSX.Element[] => {
        if (appointment.services != null && appointment.services.length > 0) {
            const services = appointment.services?.map((value, index) => <span key={index}>{value.name}</span>);
            return services;
        }
        return `-`
    }

    const CardContent = (): JSX.Element => {
        return <>
            {data.patient && <SectionElement label={Strings.patientId} value={`${data.patient?.id}`} icon={<RiHashtag />} />}
            <SectionElement label={Strings.pad} value={getPatientPad(data)} icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.dateAndTime} value={`${data.appointment.appointment} ${data.appointment.time}`} icon={<RiCalendar2Line />} />
            <SectionElement label={Strings.branchOffice} value={data.branchOffice.name} icon={<RiMentalHealthLine />} />
            <SectionElement label={Strings.email} value={getPatientEmail(data)} icon={<RiMailLine />} />
            <SectionElement label={Strings.phoneNumber} value={getPatientPrimaryContact(data)} icon={<RiPhoneLine />} />
            <SectionElement label={Strings.dentist} value={getDentist(data)} icon={<RiMentalHealthLine />} />
            <SectionElement label={Strings.services} value={buildServices()} icon={<RiServiceLine />} />
            {data.extendedTimes != null && data.extendedTimes.length > 0 &&
                <SectionElement label={'Cita extendida'} value={extendedTimesToShow(data)} icon={<RiCalendar2Line />} />}
            {data.appointment.status != 'finalizada' && data.appointment.status != 'no-atendida' &&
                <div className="flex flex-col flex-wrap">
                    <div className="ml-2 flex flex-col items-baseline gap-2 mb-2">
                        <span className="text text-base text-gray-500">{Strings.hasLabs}</span>
                        <Radio.Group onChange={(event) => handleOnHasLabs(event.target.value)} value={data.appointment.hasLabs}>
                            <Radio value={1}>Si necesita</Radio>
                            <Radio value={0}>No necesita</Radio>
                            <Radio value={2}>Ya tiene</Radio>
                        </Radio.Group>
                    </div>

                    <div className="ml-2 flex flex-col items-baseline gap-2 mb-2">
                        <span className="text text-base text-gray-500">{Strings.hasCabinet}</span>
                        <Radio.Group onChange={(event) => handleOnHasCabinet(event.target.value)} value={data.appointment.hasCabinet}>
                            <Radio value={1}>Si necesita</Radio>
                            <Radio value={0}>No necesita</Radio>
                            <Radio value={2}>Ya tiene</Radio>
                        </Radio.Group>
                    </div>
                </div>
            }
            {getStautsTag()}
            {showNextAppointment() &&
                <SectionElement label={'Siguiente cita'} value={buildNextAppointmentText()} icon={<RiCalendar2Line />} />
            }
        </>
    }

    const canRegisterNextAppointment = (): boolean => {
         return data.appointment.status == 'finalizada'
         && (data.appointment.nextAppointmentId == null || data.appointment.nextAppointmentId == undefined)
    }

    const buildNextAppointmentText = (): string => {
        if (data.appointment?.nextAppointmentDate != null) {
            if (isToday(parseISO(data.appointment?.nextAppointmentDate.toString()))) {
                return `Hoy`;
            } else {
                return `${data.appointment.nextAppointmentDate}`
            }
        }
        return `-`;
    }
    const showNextAppointment = (): boolean => {
        return data.appointment.nextAppointmentId != null && 
        data.appointment.nextAppointmentId != 0
    }

    const handleSetModalFinish = async () => {
        await handleGetPaymentMethods();
        await handleGetServices();
        setModalFinish(true)
    }
    const handleGetPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods({}).unwrap();
            setPaymentMethodList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetServices = async () => {
        try {
            const response = await getServices({}).unwrap();
            setServiceList(servicesToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const canSetDentist = (): boolean => {
        return data.appointment.status == 'activa'
    }

    const handleOnExtendAppointment = async () => {
        try {
            const appointmentDate = stringToDate(data.appointment.appointment);
            const response = await getAppointmentAvailability(
                new GetAppointmentAvailabilityRequest(
                    data.branchOffice.name,
                    dayName(appointmentDate), appointmentDate)
            ).unwrap();
            setExtendedTimesList(
                timesToSelectItemOption(filterExtendedAvailableTimes(appointment, response))
            );
            setModalExtendAppointment(true);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleExtendAppointment = async () => {
        if (extendedAvailableTimes.length == 0) {
            handleErrorNotification(Constants.EMPTY_TIMES);
            return;
        }
        setIsExtendTimesLoading(true);
        let times: string[] = [];
        for (const item of extendedAvailableTimes) {
            const value = extendedTimesList.find((_, index) => index == item);
            if (value != null && value.description != undefined) {
                times.push(value.description);
            }
        }
        try {
            const response = await extendAppointment(
                new ExtendAppointmentRequest(
                    data.appointment.id,
                    times,
                    data.appointment.appointment
                )
            ).unwrap();
            setData(response);
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setExtendedAvailableTimes([]);
            setExtendedTimesList([]);
            setIsExtendTimesLoading(false);
            setModalExtendAppointment(false);
        } catch (error) {
            setIsExtendTimesLoading(false);
            handleErrorNotification(error);
        }
    }

    return (
        <div className="m-2">
            <Card title={!hideContent ? getPatientName(data) : ''} bordered={!hideContent} actions={
                hideContent ? [] : [
                    <span onClick={() => {
                        if (isAdmin(user)) {
                            navigate(`/admin/branchoffice/appointments/detail/${data?.appointment.folio}`)
                        } else {
                            navigate(`/receptionist/appointments/detail/${data?.appointment.folio}`)
                        }
                    }}>Detalles</span>
                ]}>
                {!hideContent && CardContent()}
                <Row className="mt-4 gap-2">
                    {canSetDentist() && <Button type='dashed' onClick={() => handleOnSetDentist()} >
                        {!data.dentist ? 'Asignar dentista' : 'Cambiar dentista'}
                    </Button>}
                    {isValidDentist() && <Button type="primary" loading={isActionLoading} onClick={() => handleUpdateAppointmentStatus('proceso')} >Iniciar cita</Button>}
                    {canReschedule() && <Button type="dashed" onClick={() => handleOnReschedueAppointment()} >Reagendar</Button>}
                    {canFinish() && <Button type="primary" loading={isActionLoading} onClick={() => { handleSetModalFinish() }} >Finalizar cita</Button>}
                    {canExtendAppointment() && <Button type="dashed" onClick={() => handleOnExtendAppointment()} >Extender cita</Button>}
                    {canRegisterNextAppointment() && <Button onClick={() => handleOnNextAppointment()} >Agendar siguiente cita</Button>}
                    {canRegisterNextAppointment() && <RegisterCall patientId={data?.patient?.id} appointmentId={data?.appointment.id} />}

                </Row>

            </Card>

            <Modal title='Finalizar cita' confirmLoading={isActionLoading} onOk={() => handleUpdateAppointmentStatus('finalizada')} onCancel={() => setModalFinish(false)} open={modalFinish} okText='Finalizar' >
                <span className="flex mt-2">Método de pago</span>
                <Select style={{ minWidth: '100%' }} size="large" placeholder='Método de pago' onChange={(event) => setPaymentMethodId(event)}>
                    {paymentMethodList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                </Select>
                <span className="flex mt-2 mb-1">Costo de la cita</span>
                <Input addonBefore="$" size="large" value={amount} onChange={((event) => setAmount(event.target.value))} prefix={<></>} placeholder='10.00' />

                <span className="flex mt-2">Tipo de servicios</span>
                <MultiSelectSearch icon={<></>} placeholder="Servicios" items={serviceList} onChange={(event) => setServices(event)} />
            </Modal>

            <Modal title={'Asignar dentista'} okText={'Guardar'} confirmLoading={isActionLoading} open={modalDentist} onOk={() => handleOnSaveDentist()} onCancel={() => {
                resetSetDentistParams();
                setModalDentist(false)
            }}>
                <br />
                <SelectSearch
                    placeholder="Selecciona un paciente"
                    items={patientList}
                    onChange={(value) => setPatient(value)}
                    icon={<RiUser3Line />}
                    defaultValue={patient?.id}
                />
                <div className="flex w-full items-end justify-end my-2">
                    <Button type="link" size="small" onClick={() => handleGetPatients()}>Actualizar pacientes</Button>
                </div>
                <br />
                <SelectSearch
                    placeholder="Selecciona un dentista"
                    defaultValue={dentist?.id}
                    items={dentistList}
                    onChange={(value) => setDentist(value)}
                    icon={<RiMentalHealthLine />} />

            </Modal>

            <Modal width={'85%'} title={'Reagendar cita'} okText={'Actualizar cita'} confirmLoading={isActionLoading} open={modalReschedule} onOk={() => handleOnRescheduleAppointment()} onCancel={() => {
                resetRescheduleAppointmentParams();
                setModalReschedule(false)
            }}>
                <SelectSearch
                    placeholder="Selecciona un sucursal"
                    items={branchOfficeList}
                    onChange={handleOnBranchOfficeChange}
                    icon={<RiHospitalLine />}
                    defaultValue={branchOffice?.id ?? 0}
                />
                <br />
                {branchOffice != undefined && <Calendar validateTime={false} availableHours={times}
                    handleOnSelectDate={handleOnSelectDate}
                    isLoading={isCalendarLoading}
                    handleOnSelectTime={(value) => setTime(value)} />}

                {(time != null && time != '' && time != undefined) &&
                    <ScheduleAppointmentInfoCard
                        name={getPatientName(appointment)}
                        primaryContact={getPatientPrimaryContact(appointment)}
                        email={getPatientEmail(appointment)}
                        date={date}
                        time={time}
                        branchOfficeName={branchOffice?.label} />}

            </Modal>


            <Modal title={`Agendar próxima cita para Paciente #${data?.patient?.id} ${getPatientName(data)}`} width={'50%'} confirmLoading={isActionLoading} onOk={() => handleOnRegisterNextAppointment()} okText='Aceptar' open={modalNextAppointment} onCancel={() => setModalNextAppointment(false)}>
                <br />

                <SelectSearch
                    placeholder="Selecciona un sucursal"
                    items={branchOfficeList}
                    onChange={(event) => handleOnBranchOfficeDentistChange(event, true)}
                    icon={<RiHospitalLine />}
                    defaultValue={branchOffice?.id ?? 0}
                />
                <br />
                <SelectSearch
                    placeholder="Selecciona un dentista"
                    items={dentistList}
                    onChange={(event) => handleOnBranchOfficeDentistChange(event, false)}
                    icon={<RiMentalHealthLine />}
                    defaultValue={dentist?.id ?? 0}
                />

                <div className="ml-5">
                    <div className="flex flex-col gap-2 mb-4 mt-6">
                        <span >Laboratorios: </span>
                        <Radio.Group onChange={(event) => setHasLabs(event.target.value)} value={hasLabs}>
                            <Radio value={1}>Si necesita</Radio>
                            <Radio value={0}>No necesita</Radio>
                            <Radio value={2}>Ya tiene</Radio>
                        </Radio.Group>
                    </div>
                    <div className="flex flex-col gap-2 mb-4 mt-6">
                        <span >Estudios: </span>
                        <Radio.Group onChange={(event) => setHasCabinet(event.target.value)} value={hasCabinet}>
                            <Radio value={1}>Si necesita</Radio>
                            <Radio value={0}>No necesita</Radio>
                            <Radio value={2}>Ya tiene</Radio>
                        </Radio.Group>
                    </div>

                    <span className="flex mt-2">Tipo de servicios</span>
                    <MultiSelectSearch icon={<></>} placeholder="Servicios" items={serviceList} onChange={(event) => setServices(event)} />
                </div>

                <br />
                <Calendar availableHours={times}
                    validateTime={false}
                    handleOnSelectDate={handleOnCalendarDentistChange}
                    isLoading={isCalendarLoading}
                    handleOnSelectTime={(value) => {
                        setTime(value)
                        window.scrollTo({ behavior: 'smooth', top: scrollRef.current.offsetTop })
                    }} />

                {(time != null && time != '' && appointment != null) &&
                    <ScheduleAppointmentInfoCard
                        name={getPatientName(appointment)}
                        primaryContact={getPatientPrimaryContact(appointment)}
                        email={getPatientEmail(appointment)}
                        date={date}
                        time={time}
                        branchOfficeName={branchOffice?.label} />}

                <br ref={scrollRef} />
            </Modal>


            <Modal confirmLoading={isExtendTimesLoading} title='Extender cita' onOk={() => handleExtendAppointment()} open={modalExtendAppointment} onCancel={() => setModalExtendAppointment(false)} okText='Guardar'>
                <span className="flex mt-2">Selecciona los horarios</span>
                <MultiSelectSearch icon={<></>} placeholder="Horarios" items={extendedTimesList} onChange={(event) => setExtendedAvailableTimes(event)} />
            </Modal>


        </div >
    );
}

export const CustomSpacer = () => {
    return (<div className="w-2"></div>);
}

export default AppointmentCard;
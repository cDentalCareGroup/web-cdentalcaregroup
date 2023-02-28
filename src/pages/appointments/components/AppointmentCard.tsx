import Card from "antd/es/card/Card";
import SectionElement from "../../components/SectionElement";
import { RiCalendar2Line, RiDeleteBin7Line, RiHashtag, RiHospitalLine, RiMailLine, RiMentalHealthLine, RiMoneyDollarCircleLine, RiPhoneLine, RiServiceLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { buildPatientName, buildPatientPad, getDentist, getPatientEmail, getPatientName, getPatientPad, getPatientPrimaryContact } from "../../../data/patient/patient.extensions";
import { AppointmentDetail } from "../../../data/appointment/appointment.detail";
import { Button, Form, Input, Modal, Radio, Row, Select, Table, Tag } from "antd";
import { useGetEmployeesByTypeMutation } from "../../../services/employeeService";
import { GetEmployeeByTypeRequest } from "../../../data/employee/employee.request";
import { useEffect, useRef, useState } from "react";
import SelectItemOption from "../../../data/select/select.item.option";
import { employeesToSelectItemOptions } from "../../../data/employee/employee.extentions";
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
import { dayName, formatPrice, isAdmin, stringToDate } from "../../../utils/Extensions";
import Calendar from "../../components/Calendar";
import { AvailableTime } from "../../../data/appointment/available.time";
import { availableTimesToTimes } from "../../../data/appointment/available.times.extensions";
import { useGetBranchOfficesMutation } from "../../../services/branchOfficeService";
import ScheduleAppointmentInfoCard from "./ScheduleAppointmentInfoCard";
import { format, isToday, parseISO } from "date-fns";
import useSessionStorage from "../../../core/sessionStorage";
import Constants from "../../../utils/Constants";
import { useNavigate } from "react-router-dom";
import Strings from "../../../utils/Strings";
import { extendedTimesToShow, filterExtendedAvailableTimes, getAppointmentStatus } from "../../../data/appointment/appointment.extensions";
import { Employee } from "../../../data/employee/employee";
import { PaymentMethod } from "../../../data/payment/payment.method";
import { servicesToSelectItemOption } from "../../../data/service/service.extentions";
import MultiSelectSearch from "../../components/MultiSelectSearch";
import { useGetPadServicesMutation } from "../../../services/padService";
import EditableTable from "./EditableTableService";
import { PadComponentUsed } from "../../../data/pad/pad.component.used";
import { Service } from "../../../data/service/service";
import Spinner from "../../components/Spinner";
import FormCall from "../../callcenter/FormCall";
import EditableSortableTable from "./Test";
const { confirm } = Modal;

interface AppointmentCardProps {
    appointment: AppointmentDetail,
    onStatusChange: (status: string) => void;
    onAppointmentChange?: (appointment: AppointmentDetail) => void;
    hideContent: boolean;
    onlyRead?: boolean;
}


const AppointmentCard = ({ appointment, onStatusChange, hideContent, onAppointmentChange, onlyRead }: AppointmentCardProps) => {
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
    const [getPadServices] = useGetPadServicesMutation();

    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
    const [paymentMethodId, setPaymentMethodId] = useState(0);

    const [serviceList, setServiceList] = useState<SelectItemOption[]>([]);
    const [paymentDataTable, setPaymentDataTable] = useState<any[]>([]);

    const [services, setServices] = useState<number[]>();
    const [dataServices, setDataServices] = useState<Service[]>([]);
    const [dataTable, setDataTable] = useState<any[]>([]);


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
    const [amountReceived, setAmountReceived] = useState('0')
    const [padComponent, setPadComponent] = useState<PadComponentUsed>();
    const [isTableLoading, setIsTableLoading] = useState(false);

    const [showExchange, setShowExchange] = useState(false);

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

    const checkDueDate = (): JSX.Element => {
        const date = new Date(data.appointment.appointment);
        date.setDate(date.getDate() + 1);
        if (isToday(date)) {
            const arrayTime = data.appointment.time.split(":");
            const hour = Number(arrayTime[0]);
            const minutes = Number(arrayTime[1]);
            const today = new Date();
            if (hour <= today.getHours() && minutes <= today.getMinutes() && data.appointment.status == 'activa') {
                return <Tag color="red">{Strings.notAttendedAppointment}</Tag>
            }
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
            const filtered = response.filter((value: any, _: any) => value.originBranchOfficeId == Number(branchId))
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
                if (dataTable?.length == null || dataTable.length == 0) {
                    handleErrorNotification(Constants.EMPTY_SERVICE);
                    return;
                }
            }
            setIsActionLoading(true);
            const response = await updateAppointmentStatus(
                new UpdateAppointmentStatusRequest(
                    data.appointment.id,
                    status,
                    getTotalFromServices().toString(),
                    getTotalFromPaymentMethod().toString(),
                    dataTable,
                    paymentDataTable,
                    padComponent?.pad.id ?? 0
                )).unwrap();
            setData(response);
            onStatusChange(status);
            setIsActionLoading(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
            onAppointmentChange?.(response);
        } catch (error) {
            setIsActionLoading(false);
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
        const dentistFound = appointmentToDentistSelectItemOption(data);
        setDentist(dentistFound);

        if (isAdmin(user)) {
            await handleGetBranchOffices();
        } else {
            if (branchOfficeOption != null) setBranchOfficeList([branchOfficeOption]);
        }

        await handleGetDentist();
        handleGetDentistAvailability(
            dentistFound.id,
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

    const buildCall = () => {
        return `${data.appointment.call?.dueDate ?? ''}`;
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
            {data.appointment.status != 'finalizada' && data.appointment.status != 'no-atendida' && onlyRead == false &&
                <div className="flex flex-col flex-wrap">
                    <div className="ml-2 flex flex-col items-baseline gap-2 mb-2">
                        <span className="text text-base text-gray-500">{Strings.hasLabs}</span>
                        <Radio.Group onChange={(event) => handleOnHasLabs(event.target.value)} value={data.appointment.hasLabs}>
                            <Radio value={1}>{Strings.optionNeeds}</Radio>
                            <Radio value={0}>{Strings.optionNoNeeds}</Radio>
                            <Radio value={2}>{Strings.optionAlreadyHas}</Radio>
                        </Radio.Group>
                    </div>

                    <div className="ml-2 flex flex-col items-baseline gap-2 mb-2">
                        <span className="text text-base text-gray-500">{Strings.hasCabinet}</span>
                        <Radio.Group onChange={(event) => handleOnHasCabinet(event.target.value)} value={data.appointment.hasCabinet}>
                            <Radio value={1}>{Strings.optionNeeds}</Radio>
                            <Radio value={0}>{Strings.optionNoNeeds}</Radio>
                            <Radio value={2}>{Strings.optionAlreadyHas}</Radio>
                        </Radio.Group>
                    </div>
                </div>
            }
            {getStautsTag()}
            {checkDueDate()}
            {showNextAppointment() &&
                <SectionElement label={Strings.followAppointment} value={buildNextAppointmentText()} icon={<RiCalendar2Line />} />
            }
            {showNextCall() && <SectionElement label={'Llamada agendada'} value={buildCall()} icon={<RiPhoneLine />} />
            }
        </>
    }

    const canRegisterNextAppointment = (): boolean => {
        return data.appointment.status == 'finalizada'
            && ((data.appointment?.call == null || data.appointment?.call == undefined) && (data.appointment.nextAppointmentId == null || data.appointment.nextAppointmentId == undefined))
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

    const showNextCall = (): boolean => {
        return data.appointment.call != null && data.appointment.call != undefined
    }

    const handleSetModalFinish = async () => {
        await handleGetPaymentMethods();
        await handleGetServices();
        // await handleGetPadServices();
        setModalFinish(true)
    }

    const handleGetPadServices = async () => {
        try {
            const response = await getPadServices(
                { 'patientId': appointment.patient?.id }
            ).unwrap();
            setPadComponent(response);
        } catch (error) {
            console.log(error);
        }
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
            setDataServices(response);
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


    const handleOnServiceChange = (service: SelectItemOption) => {
        setIsTableLoading(true);
        const serviceItem = dataServices.find((value, _) => value.id == service.id);
        let tableInfo = dataTable;
        const servicePrice = serviceItem?.price ?? 0;
        setDataTable([]);

        let discount = 0;
        let subTotal = 0;
        let price = 0;
        // if (padComponent != null && padComponent.components.length > 0) {
        //     const component = padComponent.components.find((value, _) => value.component.serviceId == service.id)
        //     if (component != null) {
        //         discount = Math.round(component.component.discount);
        //         subTotal = servicePrice - Math.round(((1 * servicePrice) / 100) * discount);
        //     } else {
        //         subTotal = servicePrice;
        //     }
        // } else {
        //     subTotal = servicePrice;
        // }

        // if (discount > 0) {
        //     console.log('pad')
        // } else {
        //     price = servicePrice;
        // }
        price = servicePrice;
        subTotal = price * 1;

        tableInfo.push(
            {
                key: tableInfo.length + 1,
                description: serviceItem?.name ?? '',
                quantity: 1,
                unitPrice: servicePrice,
                disscount: discount,
                price: price,
                subtotal: subTotal,
                serviceId: serviceItem?.id
            },
        );
        setTimeout(() => {
            setDataTable(tableInfo);
            setIsTableLoading(false);
        }, 100)
        //  }
    }

    const handleOnTableChange = (data: any) => {
        setDataTable(data);
        //  updateServiceTable(data);
    }


    const getTotalFromServices = (): number => {
        let total = 0;
        for (const service of dataTable) {
            total += Number(service.subtotal);
        }
        return total;
    }

    const getTotalFromPaymentMethod = (): number => {
        let total = 0;
        for (const payment of paymentDataTable) {
            total += Number(payment.amount);
        }
        return total;
    }

    const getExchange = (): string => {
        let res = getTotalFromPaymentMethod() - getTotalFromServices();
        return formatPrice(res);
    }

    const validateExchange = (): string => {
        if (getTotalFromPaymentMethod() == 0) {
            return 'Saldo pendiente :'
        } else if (getTotalFromPaymentMethod() < getTotalFromServices()) {
            return 'Saldo pendiente :'
        } else {
            return 'Cambio :'
        }
    }

    // const updateServiceTable = (pastData: any) => {
    //     setIsTableLoading(true);
    //     setDataTable([]);
    //     const amount = Number(amountReceived);
    //     const newData = [];
    //     let totalAmount = amount;
    //     for (const item of pastData) {
    //         if (Number(item.subtotal) > 0 && totalAmount > 0) {
    //             if (totalAmount >= Number(item.subtotal)) {
    //                 totalAmount = totalAmount - Number(item.subtotal);
    //                 item.paid = Number(item.subtotal);
    //             } else {
    //                 item.paid = totalAmount;
    //                 totalAmount = 0;
    //             }
    //         } else {
    //             item.paid = 0;
    //         }
    //         newData.push(item);
    //     }
    //     setDataTable(newData);
    //     setIsTableLoading(false);
    // }


    const serviceTableColums = [
        {
            title: Strings.paymentMethod,
            dataIndex: 'paymentmethod',
        },
        {
            title: Strings.receivedAmount,
            dataIndex: 'amount',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span>{formatPrice(value.amount)}</span>
                </div>
            ),
        },
        {
            title: Strings.actions,
            dataIndex: 'actions',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <RiDeleteBin7Line size={20} onClick={() => handleOnDeletePaymentMethod(value.key)} className="text text-red-600" />
                </div>
            ),
        },
    ];

    const handleOnPaymentAdd = () => {
        // if (amountReceived == '' || amountReceived == null || amountReceived == '0') {
        //     handleErrorNotification(Constants.EMPTY_AMOUNT);
        //     return
        // }
        const payment = paymentMethodList.find((value, _) => value.id == paymentMethodId);
        const data = paymentDataTable;
        if (data.find((value, _) => value.key == paymentMethodId)) {
            handleErrorNotification(Constants.EXISTING_PAYMENT_METHOD);
            return;
        }
        setPaymentDataTable([]);
        data.push({
            key: paymentMethodId,
            paymentmethod: payment?.name ?? '',
            amount: amountReceived
        });
        validateShowExchange();
        setTimeout(() => {
            setPaymentDataTable(data);
        }, 100)
    }

    const handleOnDeletePaymentMethod = (key: any) => {
        const data = paymentDataTable.filter((value, _) => value.key != key);
        setPaymentDataTable([]);
        setTimeout(() => {
            setPaymentDataTable(data);
        }, 100)
    }

    const getReceivedAmount = (): number => {
        let total = 0;
        paymentDataTable.forEach((value, _) => total += Number(value.amount));
        return total;
    }

    const validateShowExchange = () => {
        const value = paymentDataTable.find((value, _) => (value.paymentmethod as String).includes('Efectivo'));
        setShowExchange(value != null);
    }

    return (
        <div className="m-2">
            <Card title={!hideContent ? getPatientName(data) : ''} bordered={!hideContent} actions={
                (hideContent || onlyRead == true) ? [] : [
                    <span onClick={() => {
                        if (isAdmin(user)) {
                            navigate(`/admin/branchoffice/appointments/detail/${data?.appointment.folio}`)
                        } else {
                            navigate(`/receptionist/appointments/detail/${data?.appointment.folio}`)
                        }
                    }}>{Strings.details}</span>
                ]}>
                {!hideContent && CardContent()}
                {(onlyRead == false) && <Row className="mt-4 gap-2">
                    {canSetDentist() && <Button type='dashed' onClick={() => handleOnSetDentist()} >
                        {!data.dentist ? Strings.assignDentist : Strings.changeDentist}
                    </Button>}
                    {isValidDentist() && <Button type="primary" loading={isActionLoading} onClick={() => handleUpdateAppointmentStatus('proceso')} >{Strings.startAppointment}</Button>}
                    {canReschedule() && <Button type="dashed" onClick={() => handleOnReschedueAppointment()} >{Strings.rescheduleAppointment}</Button>}
                    {canFinish() && <Button type="primary" loading={isActionLoading} onClick={() => { handleSetModalFinish() }} >{Strings.finishAppointment}</Button>}
                    {canExtendAppointment() && <Button type="dashed" onClick={() => handleOnExtendAppointment()} >{Strings.extendAppointment}</Button>}
                    {canRegisterNextAppointment() && <Button onClick={() => handleOnNextAppointment()} >{Strings.scheduleNextAppointment}</Button>}
                    {canRegisterNextAppointment() && <FormCall appointmentId={data.appointment.id} patientId={data.patient?.id} showPatients={false} onFinish={() => onStatusChange('finalizada')} />}
                </Row>}

            </Card>

            <Modal width={'85%'} title={
                `${Strings.finishAppointment} - ${buildPatientName(data.patient)} - ${buildPatientPad(data.patient)}`
            } confirmLoading={isActionLoading} onOk={() => {
                confirm({
                    content: <span>{Strings.askFinishAppointment}</span>,
                    onOk() {
                        handleUpdateAppointmentStatus('finalizada');
                    },
                    okText: Strings.finish,
                    cancelText: Strings.cancel,
                });
            }} onCancel={() => setModalFinish(false)} open={modalFinish} okText={Strings.finish} >

                <span className="flex mt-2">{Strings.serviceType}</span>
                <SelectSearch icon={<></>} placeholder={Strings.services} items={serviceList} onChange={(event) => handleOnServiceChange(event)} />
                <br />

                {!isTableLoading && <EditableTable onChange={handleOnTableChange} isLoading={isTableLoading} data={dataTable} />}
                {isTableLoading && <Spinner />}


                <div className="flex flex-row gap-6">
                    <div className="flex flex-col">
                        <span className="flex mt-2">{Strings.paymentMethod}</span>
                        <Select style={{ minWidth: 250 }} size="large" placeholder={Strings.paymentMethod} onChange={(event) => setPaymentMethodId(event)}>
                            {paymentMethodList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                        </Select>
                    </div>

                    <div className="flex flex-col">
                        <span className="flex mt-2">{Strings.receivedAmount}</span>
                        <Input addonBefore="$"
                            size="large"
                            value={amountReceived}
                            onChange={((event) => setAmountReceived(event.target.value))}
                            prefix={<></>}
                            placeholder='10.00' />
                    </div>
                    <div className="flex flex-col mt-8">
                        <Button onClick={() => handleOnPaymentAdd()}>Agregar</Button>
                    </div>
                </div>

                <Table className="mt-4" columns={serviceTableColums} dataSource={paymentDataTable} />



                <div className="flex flex-row w-full items-end justify-end gap-2 mt-2">
                    <span className="text font-bold text-base text-gray-600">
                        {Strings.receivedAmount}:
                    </span>
                    <span className="text font-semibold text-base">
                        {formatPrice(getReceivedAmount())}
                    </span>
                </div>

                <div className="flex flex-row w-full items-end justify-end gap-2">
                    <span className="text font-bold text-base text-gray-600">
                        {Strings.total}:
                    </span>
                    <span className="text font-semibold text-base">
                        {formatPrice(getTotalFromServices())}
                    </span>
                </div>


                {showExchange && <div className="flex flex-row w-full items-end justify-end gap-2 mb-4">
                    <span className="text font-bold text-base text-gray-600">
                        {validateExchange()}
                    </span>
                    <span className="text font-semibold text-base">
                        {getExchange()}
                    </span>
                </div>}

            </Modal>

            <Modal title={Strings.assignDentist} okText={Strings.save} confirmLoading={isActionLoading} open={modalDentist} onOk={() => handleOnSaveDentist()} onCancel={() => {
                resetSetDentistParams();
                setModalDentist(false)
            }}>
                <br />
                <SelectSearch
                    placeholder={Strings.selectPatient}
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
                    placeholder={Strings.selectDentist}
                    defaultValue={dentist?.id}
                    items={dentistList}
                    onChange={(value) => setDentist(value)}
                    icon={<RiMentalHealthLine />} />

            </Modal>

            <Modal width={'85%'} title={Strings.rescheduleAppointment} okText={Strings.updateAppointment} confirmLoading={isActionLoading} open={modalReschedule} onOk={() => handleOnRescheduleAppointment()} onCancel={() => {
                resetRescheduleAppointmentParams();
                setModalReschedule(false)
            }}>
                <SelectSearch
                    placeholder={Strings.selectBranchOffice}
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


            <Modal title={`${Strings.scheduleNextAppointmentPatient} #${data?.patient?.id} ${getPatientName(data)}`} width={'50%'} confirmLoading={isActionLoading} onOk={() => handleOnRegisterNextAppointment()} okText={Strings.accept} open={modalNextAppointment} onCancel={() => {
                setIsActionLoading(false);
                setModalNextAppointment(false)
            }}>
                <br />

                <SelectSearch
                    placeholder={Strings.selectBranchOffice}
                    items={branchOfficeList}
                    onChange={(event) => handleOnBranchOfficeDentistChange(event, true)}
                    icon={<RiHospitalLine />}
                    defaultValue={branchOffice?.id ?? 0}
                />
                <br />
                <SelectSearch
                    placeholder={Strings.selectDentist}
                    items={dentistList}
                    onChange={(event) => handleOnBranchOfficeDentistChange(event, false)}
                    icon={<RiMentalHealthLine />}
                    defaultValue={dentist?.id ?? 0}
                />

                <div className="ml-5">
                    <div className="flex flex-col gap-2 mb-4 mt-6">
                        <span >{Strings.labs}: </span>
                        <Radio.Group onChange={(event) => setHasLabs(event.target.value)} value={hasLabs}>
                            <Radio value={1}>{Strings.optionNeeds}</Radio>
                            <Radio value={0}>{Strings.optionNoNeeds}</Radio>
                            <Radio value={2}>{Strings.optionAlreadyHas}</Radio>
                        </Radio.Group>
                    </div>
                    <div className="flex flex-col gap-2 mb-4 mt-6">
                        <span >{Strings.cabinets}: </span>
                        <Radio.Group onChange={(event) => setHasCabinet(event.target.value)} value={hasCabinet}>
                            <Radio value={1}>{Strings.optionNeeds}</Radio>
                            <Radio value={0}>{Strings.optionNoNeeds}</Radio>
                            <Radio value={2}>{Strings.optionAlreadyHas}</Radio>
                        </Radio.Group>
                    </div>

                    <span className="flex mt-2">{Strings.serviceType}</span>
                    <MultiSelectSearch icon={<></>} placeholder={Strings.services} items={serviceList} onChange={(event) => setServices(event)} />
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


            <Modal confirmLoading={isExtendTimesLoading} title={Strings.extendAppointment} onOk={() => handleExtendAppointment()} open={modalExtendAppointment} onCancel={() => setModalExtendAppointment(false)} okText={Strings.save}>
                <span className="flex mt-2">{Strings.selectSchedule}</span>
                <MultiSelectSearch icon={<></>} placeholder={Strings.schedule} items={extendedTimesList} onChange={(event) => setExtendedAvailableTimes(event)} />
            </Modal>
        </div>
    );
}

export const CustomSpacer = () => {
    return (<div className="w-2"></div>);
}

export default AppointmentCard;
import { Button, Card, Collapse, DatePicker, Divider, List, Modal, Row, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { differenceInDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine, RiArrowUpSLine, RiCalendar2Line, RiFunctionLine, RiMailLine, RiMentalHealthLine, RiPhoneLine, RiServiceLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { UpdateCallRequest } from "../../data/call/call.request";
import { CallCatalogDetail, GetCallDetail, GetCalls } from "../../data/call/call.response";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPhone, getDentist, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import { useGetCallDetailMutation, useGetCatalogsMutation, useNotAttendedCallMutation, useUpdateCallMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import FormAppointment from "../appointments/FormAppointment";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormCall from "./FormCall";

const CallInfo = () => {

    const [updateCall] = useUpdateCallMutation();
    const navigate = useNavigate();
    const [getCallDetailMutation] = useGetCallDetailMutation();
    const [notAttendedCall] = useNotAttendedCallMutation();

    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );
    const [data, setData] = useState<GetCalls>();
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [info, setInfo] = useState<GetCallDetail>();

    const [lastBaranchOffice, setLastBranchOffice] = useState('');

    useEffect(() => {
        handleSetupValues();
    }, []);


    const handleSetupValues = () => {
        const info = call as GetCalls;
        setData(info);
        handleGetCallDetail(info);
    }

    const handleGetCallDetail = async (call: GetCalls) => {
        try {
            setIsLoading(true);
            const response = await getCallDetailMutation({ 'patientId': call.patient?.id, 'prospectId': call.propspect?.id }).unwrap();
            setInfo(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }


    const buildDifferenceInDays = () => {
        const startDate = new Date(call?.patient?.padAcquisitionDate ?? '');
        const endDate = new Date(call?.patient?.padExpirationDate ?? '')
        const days = differenceInDays(endDate, startDate);
        return `${days}`;
    }

    const padInfoContent = () => {
        return (<div >
            <SectionElement label={Strings.patientName} value={buildPatientName(data?.patient)} icon={<RiUser3Line />} size='sm' />
            <SectionElement label={Strings.pad} value={data?.patient?.pad ? 'Si' : 'No'} icon={<RiUserHeartLine />} size='sm' />
            <SectionElement label={Strings.adquisitionDate} value={data?.patient?.padAcquisitionDate ?? ''} icon={<RiUserHeartLine />} size='sm' />
            <SectionElement label={Strings.dueDate} value={data?.patient?.padExpirationDate ?? ''} icon={<RiUserHeartLine />} size='sm' />
            <SectionElement label={Strings.daysDueDate} value={buildDifferenceInDays()} icon={<RiUserHeartLine />} size='sm' />
        </div>)
    }

    const patientiInfo = () => {
        return (<div className="w-full flex-1">
            <SectionElement label={Strings.patientName} value={buildPatientName(data?.patient)} icon={<RiUser3Line />} size='sm' />
            <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(data?.patient)} icon={<RiPhoneLine />} size='sm' />
            <SectionElement label={Strings.birthday} value={buildPatientBirthday(data?.patient)} icon={<RiCalendar2Line />} size='sm' />
            <SectionElement label={Strings.gender} value={buildPatientGender(data?.patient)} icon={<RiUser3Line />} size='sm' />
            <SectionElement label={Strings.email} value={buildPatientEmail(data?.patient)} icon={<RiMailLine />} size='sm' />
            <SectionElement label={Strings.address} value={buildPatientAddress(data?.patient)} icon={<RiFunctionLine />} size='sm' />
        </div>)
    }


    const buildCardTitle = (): string => {
        return `${data?.catalog.name}`;
    }

    const cardInfoContent = (): JSX.Element => {
        let isPad = data?.catalog.name.includes('pad vencido');
        let isNotShow = data?.catalog.name.includes('no-show')

        return (
            <div className="w-full flex-1">
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    style={{ backgroundColor: '#fff' }}
                    expandIcon={({ isActive }) => isActive ? <RiArrowDownSLine /> : <RiArrowRightSLine />} >

                    <Collapse.Panel header={Strings.callInfo} key="1" className="text font-semibold">
                        <div className="flex flex-col mx-6">
                            <span className="text text-sm font-normal">{data?.call.description ?? '-'}</span>
                        </div>
                        <div className="flex flex-col mx-6 mt-4">
                            <span className="text text-sm font-normal">Notas: </span>
                            <span className="text text-sm font-normal">{data?.call.callComments ?? '-'}</span>
                        </div>
                    </Collapse.Panel>

                    {isPad && <Collapse.Panel header={Strings.padInfo} key="2" className="text font-semibold">
                        <div className="flex mx-6">
                            {padInfoContent()}
                        </div>
                    </Collapse.Panel>}

                    {isNotShow && <Collapse.Panel header={Strings.appointmentInfo} key="2" className="text font-semibold">
                        <div className="flex mx-6">
                            {notAttendedInfoContent()}
                        </div>
                    </Collapse.Panel>}

                    {data?.patient && <Collapse.Panel header={Strings.patientInformation} key="3" className="text font-semibold">
                        {patientiInfo()}
                    </Collapse.Panel>}
                    {(info?.appointments != null && info.appointments.length > 0) && <Collapse.Panel header={Strings.appointments} key="4" className="text font-semibold">
                        <List
                            bordered={false}
                            dataSource={info?.appointments}
                            renderItem={(item: AppointmentDetail) => (
                                <List.Item>
                                    <Card title={`${item.appointment.appointment} ${item.appointment.time}`} >
                                        <div className="flex flex-col">
                                            <SectionElement label={Strings.branchOffice} value={item.branchOffice.name} icon={<RiMentalHealthLine />} />
                                            <SectionElement label={Strings.dentist} value={getDentist(item)} icon={<RiMentalHealthLine />} />
                                            <SectionElement label={Strings.services} value={buildServices(item)} icon={<RiServiceLine />} />
                                            {getAppointmentStatusTag(item)}
                                        </div>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Collapse.Panel>}
                    <Collapse.Panel header={Strings.history} key="5" className="text font-semibold">
                        <List
                            bordered={false}
                            dataSource={info?.calls}
                            renderItem={(item: CallCatalogDetail) => (
                                <List.Item>
                                    <div className="flex flex-col">
                                        <span className="text text-sm font-semibold">{`${Strings.date} ${item?.callDueDate ?? 'Sin fecha'} - Motivo ${item?.catalogName}`}</span>
                                        <span className="text text-sm font-normal">{`${Strings.description} - ${item.description}`}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Collapse.Panel>
                </Collapse>
            </div>);
    }


    const buildServices = (appointment: AppointmentDetail): string | JSX.Element[] => {
        if (appointment.services != null && appointment.services.length > 0) {
            const services = appointment.services?.map((value, index) => <span key={index}>{value.name}</span>);
            return services;
        }
        return `-`
    }

    const getAppointmentStatusTag = (appointment: AppointmentDetail): JSX.Element => {
        if (appointment.appointment.status == Constants.STATUS_ACTIVE) {
            return <Tag color="success">{getAppointmentStatus(appointment)}</Tag>
        }
        if (appointment.appointment.status == Constants.STATUS_PROCESS) {
            return <Tag color="blue">{getAppointmentStatus(appointment)}</Tag>
        }
        if (appointment.appointment.status == Constants.STATUS_FINISHED) {
            return <Tag color="default">{getAppointmentStatus(appointment)}</Tag>
        }
        if (appointment.appointment.status == Constants.STATUS_NOT_ATTENDED) {
            return <Tag color="red">{getAppointmentStatus(appointment)}</Tag>
        }
        return <></>;
    }
    const getAppointmentStatus = (appointment: AppointmentDetail | undefined) => {
        return `${appointment?.appointment.status.toUpperCase() ?? ''}`;
    }

    const buildNotAttendedDate = () => {
        const startDate = new Date(call?.appointment?.scheduledAt ?? '');
        const endDate = new Date()
        const days = differenceInDays(endDate, startDate);
        return `${days}`;
    }

    const notAttendedInfoContent = (): JSX.Element => {
        return (
            <div>
                {call.patient && <SectionElement label={Strings.patientName} value={buildPatientName(call?.patient)} icon={<RiUser3Line />} size='sm' />}
                {call.propspect && <SectionElement label={Strings.patientName} value={call?.propspect?.name} icon={<RiUser3Line />} size='sm' />}
                <SectionElement label={Strings.dateTimeAppointent} value={call?.appointment?.scheduledAt.toString() ?? ''} icon={<RiUserHeartLine />} size='sm' />
                <SectionElement label={Strings.daysDue} value={buildNotAttendedDate()} icon={<RiUserHeartLine />} size='sm' />
            </div>
        );
    }

    const buildTitle = (): string => {
        if(info?.appointments != null && info.appointments.length > 0) {
            const res = info.appointments[info.appointments.length - 1];
            return `Agendar nueva cita - Sucursal del paciente: ${res.branchOffice.name}`;
        } else {
            return ''
        }
    }

    const callActions = (): JSX.Element => {
        return (<div className="w-full flex-1">
            <span className="flex flex-col flex-wrap w-full p-2 text-gray-600">
                <span className="text text-base text-gray-500">{Strings.dialog} </span>
                <div className="p-2" dangerouslySetInnerHTML={{ __html: call?.catalog.script ?? '' }} />
            </span>
            <TextArea
                showCount
                rows={6}
                maxLength={150}
                style={{ height: 120, marginBottom: 5 }}
                onChange={(event) => setComment(event.target.value)}
                placeholder={Strings.callDetail}
            />
            <div className="flex mt-6 w-full justify-end items-end">
                <Button loading={isLoadingAction} disabled={data?.call.status != Constants.STATUS_ACTIVE} type="dashed" onClick={() => handleUpdateCall()}>{Strings.save}</Button>
            </div>

            <div className="flex flex-row items-center justify-evenly mt-6 w-full">
                <FormCall callId={data?.call.id} patientId={data?.patient?.id} prospectId={data?.propspect?.id} showPatients={false} onFinish={() => navigate(-1)} />
                <div className="flex w-full items-end justify-end mx-4">
                    <Button onClick={() => handleCallNotAttended()} type="dashed">Llamada no contestada</Button>
                </div>
                <FormAppointment title={buildTitle()} rol={UserRoles.CALL_CENTER} callId={data?.call.id} patient={data?.patient} prospect={data?.propspect} onFinish={() => navigate(-1)} />

            </div>

        </div>)
    }

    const handleUpdateCall = async () => {
        try {
            setIsLoadingAction(true);
            await updateCall(new UpdateCallRequest(data?.call.id ?? 0, comment)).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsLoadingAction(false);
            navigate(-1);
        } catch (error) {
            setIsLoadingAction(false);
            handleErrorNotification(error);
        }
    }


    const handleCallNotAttended = async () => {
        try {
            await notAttendedCall(
                new UpdateCallRequest(data?.call.id ?? 0, `Llamada no contestada ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            //navigate(-1);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const getStautsTag = (): JSX.Element => {
        if (data?.call.status == Constants.STATUS_ACTIVE) {
            return <Tag color="success">{data?.call.status}</Tag>
        }
        if (data?.call.status == Constants.STATUS_SOLVED) {
            return <Tag color="default">{data?.call.status}</Tag>
        }
        return <></>;
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            title={buildCardTitle()}
            showBack={false}
            content={
                <div className="flex flex-col">
                    <div className="flex">
                        {getStautsTag()}
                    </div>
                    <Divider />
                    <div className="flex flex-wrap flex-row justify-between p-2 gap-4">
                        {callActions()}
                        {cardInfoContent()}
                    </div>
                </div>
            }
        />
    );
}
export default CallInfo;
import { Button, Collapse, DatePicker, Divider, List, Modal, Row, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine, RiArrowUpSLine, RiCalendar2Line, RiFunctionLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { UpdateCallRequest } from "../../data/call/call.request";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPhone, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import { useGetCallDetailMutation, useGetCatalogsMutation, useUpdateCallMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import RegisterCall from "./RegisterCall";

const CallInfo = () => {

    const [updateCall] = useUpdateCallMutation();
    const navigate = useNavigate();
    const [getCallDetailMutation] = useGetCallDetailMutation();

    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );
    const [data, setData] = useState<GetCalls>();
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [info, setInfo] = useState<any>();

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
            console.log(response);
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
            <SectionElement label={'Fecha de adquisicion'} value={data?.patient?.padAcquisitionDate ?? ''} icon={<RiUserHeartLine />} size='sm' />
            <SectionElement label={'Fecha de vencimiento'} value={data?.patient?.padExpirationDate ?? ''} icon={<RiUserHeartLine />} size='sm' />
            <SectionElement label={'Dias vencido'} value={buildDifferenceInDays()} icon={<RiUserHeartLine />} size='sm' />
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
        if (data?.catalog.name.includes('pad vencido')) {
            return `${data.appointment?.branchName} - Pad Vencido`
        } else if (data?.catalog.name.includes('cita-no-show')) {
            return `${data.appointment?.branchName} - Cita no atendida`
        } else if (data?.catalog.name.includes('presupuesto')) {
            return 'Presuperto'
        }
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

                    <Collapse.Panel header="Información de la llamada" key="1" className="text font-semibold">
                        <div className="flex mx-6">
                            <span className="text text-sm font-normal">{data?.call.description ?? '-'}</span>
                        </div>
                    </Collapse.Panel>

                    {isPad && <Collapse.Panel header="Información del PAD" key="2" className="text font-semibold">
                        <div className="flex mx-6">
                            {padInfoContent()}
                        </div>
                    </Collapse.Panel>}

                    {isNotShow && <Collapse.Panel header="Información del la cita" key="2" className="text font-semibold">
                        <div className="flex mx-6">
                            {notAttendedInfoContent()}
                        </div>
                    </Collapse.Panel>}

                    {data?.patient && <Collapse.Panel header="Información del paciente" key="3" className="text font-semibold">
                        {patientiInfo()}
                    </Collapse.Panel>}
                    <Collapse.Panel header="Historial de llamadas" key="4" className="text font-semibold">
                        <List
                            bordered={false}
                            dataSource={info}
                            renderItem={(item: any) => (
                                <List.Item>
                                    <span className="text text-sm font-normal">{`Fecha ${item?.callDueDate ?? 'Sin fecha'} - Motivo ${item?.catalogName}`}</span>
                                </List.Item>
                            )}
                        />
                    </Collapse.Panel>
                </Collapse>
            </div>);
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
                <SectionElement label={'Hora y Fecha de la cita'} value={call?.appointment?.scheduledAt.toString() ?? ''} icon={<RiUserHeartLine />} size='sm' />
                <SectionElement label={'Dias vencida'} value={buildNotAttendedDate()} icon={<RiUserHeartLine />} size='sm' />
            </div>
        );
    }

    const callActions = (): JSX.Element => {
        return (<div className="w-full flex-1">
            <span className="flex flex-col flex-wrap w-full p-2 text-gray-600">
                <span className="text text-base text-gray-500">Dialogo: </span>
                <div className="p-2" dangerouslySetInnerHTML={{ __html: call?.catalog.script ?? '' }} />
            </span>
            <TextArea
                showCount
                rows={6}
                maxLength={150}

                style={{ height: 120, marginBottom: 5 }}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Detalle de la llamada"
            />
            <div className="flex mt-6 w-full justify-end items-end">
                <Button loading={isLoadingAction} disabled={data?.call.status != 'activa'} type="primary" onClick={() => handleUpdateCall()}>Guardar</Button>
            </div>
            <Button type="dashed" onClick={() => {
                 window.open(`https://cdentalcaregroup-fcdc9.web.app/appointment`, '_blank', 'noopener,noreferrer');
            }}>Agendar cita</Button>
            <RegisterCall patientId={data?.patient?.id} appointmentId={data?.appointment?.id} />
           
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

    const getStautsTag = (): JSX.Element => {
        if (data?.call.status == 'activa') {
            return <Tag color="success">{data?.call.status}</Tag>
        }
        if (data?.call.status == 'resuelta') {
            return <Tag color="default">{data?.call.status}</Tag>
        }
        return <></>;
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            title={buildCardTitle()}
            showBack={true}
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
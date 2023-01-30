import { Button, DatePicker, Divider, Modal, Row, Select, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { CallCatalog } from "../../data/call/call.catalog";
import { UpdateCallRequest } from "../../data/call/call.request";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientName } from "../../data/patient/patient.extensions";
import { useGetCatalogsMutation, useUpdateCallMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import RegisterCall from "./RegisterCall";

const CallInfo = () => {

    const [updateCall] = useUpdateCallMutation();
    const navigate = useNavigate();

    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );
    const [data, setData] = useState<GetCalls>();
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        handleSetupValues();
    }, []);


    const handleSetupValues = () => {
        const info = call as GetCalls;
        setData(info);
    }

    const buildDifferenceInDays = () => {
        const startDate = new Date(call?.patient?.padAcquisitionDate ?? '');
        const endDate = new Date(call?.patient?.padExpirationDate ?? '')
        const days = differenceInDays(endDate, startDate);
        return `${days}`;
    }

    const PadContent = () => {
        return (<div>
            <SectionElement label={Strings.patientName} value={buildPatientName(data?.patient)} icon={<RiUser3Line />} />
            <SectionElement label={Strings.pad} value={data?.patient.pad ? 'Si' : 'No'} icon={<RiUserHeartLine />} />
            <SectionElement label={'Fecha de adquisicion'} value={data?.patient?.padAcquisitionDate ?? ''} icon={<RiUserHeartLine />} />
            <SectionElement label={'Fecha de vencimiento'} value={data?.patient?.padExpirationDate ?? ''} icon={<RiUserHeartLine />} />
            <SectionElement label={'Dias vencido'} value={buildDifferenceInDays()} icon={<RiUserHeartLine />} />
        </div>)
    }

    const buildInitView = (): JSX.Element => {
        if (data?.catalog.name.includes('pad vencido')) {
            return PadContent();
        } else if (data?.catalog.name.includes('cita-no-show')) {
            return NotAttended();
        } else if (data?.catalog.name.includes('presupuesto')) {
            return Budget();
        }
        return <></>
    }
    const buildCardTitle = (): string => {
        if (data?.catalog.name.includes('pad vencido')) {
            return `${data.appointment?.branchName} - Pad Vencido`
        } else if (data?.catalog.name.includes('cita-no-show')) {
            return `${data.appointment?.branchName} - Cita no atendida`
        } else if (data?.catalog.name.includes('presupuesto')) {
            return 'Presuperto'
        }
        return '';
    }

    const Budget = (): JSX.Element => {
        return (
            <div>
                <SectionElement label={Strings.description} value={data?.call.description ?? ''} icon={<RiUser3Line />} />
            </div>);
    }

    const buildNotAttendedDate = () => {
        const startDate = new Date(call?.appointment?.scheduledAt ?? '');
        const endDate = new Date()
        const days = differenceInDays(endDate, startDate);
        return `${days}`;
    }

    const NotAttended = (): JSX.Element => {
        return (
            <div>
                <SectionElement label={Strings.patientName} value={buildPatientName(call?.patient)} icon={<RiUser3Line />} />
                <SectionElement label={'Hora y Fecha'} value={call?.appointment?.scheduledAt.toString() ?? ''} icon={<RiUserHeartLine />} />
                <SectionElement label={'Dias vencida'} value={buildNotAttendedDate()} icon={<RiUserHeartLine />} />
            </div>);
    }

    const CallActions = (): JSX.Element => {
        return (<div>
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

            <RegisterCall patientId={data?.patient.id} appointmentId={data?.appointment?.id} />
        </div>)
    }

    const handleUpdateCall = async () => {
        try {
            setIsLoading(true);
            await updateCall(new UpdateCallRequest(data?.call.id ?? 0, comment)).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsLoading(false);
            navigate(-1);
        } catch (error) {
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
            isLoading={data == null}
            title={buildCardTitle()}
            showBack={true}
            content={
                <div className="flex flex-col">
                    {getStautsTag()}
                    <Divider />
                    {buildInitView()}
                    {CallActions()}
                    <div className="flex mt-4 w-full justify-end items-end">
                        <Button loading={isLoading} disabled={data?.call.status != 'activa'} type="primary" onClick={() => handleUpdateCall()}>Guardar</Button>
                    </div>
                </div>
            }
        />
    );
}
export default CallInfo;
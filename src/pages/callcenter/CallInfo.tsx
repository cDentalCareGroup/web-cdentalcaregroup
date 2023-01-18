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

const CallInfo = () => {

    const [getCatalogs] = useGetCatalogsMutation();
    const [updateCall] = useUpdateCallMutation();
    const navigate = useNavigate();

    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );
    const [data, setData] = useState<GetCalls>();
    const [isOpen, setIsOpen] = useState(false);
    const [catalogs, setCatalogs] = useState<CallCatalog[]>([]);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        handleSetupValues();
        handleGetCallCatalogs();
    }, []);

    const handleGetCallCatalogs = async () => {
        try {
            setIsLoading(true);
            const response = await getCatalogs({}).unwrap();
            setCatalogs(response);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }


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
            <div>presupuesto</div>
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
            {/* <div className="flex w-full gap-2 mb-2 mt-4">
                <Button>Agendar cita</Button>
                <Button type="dashed" onClick={() => setIsOpen(true)}>Agendar llamada</Button>
            </div> */}
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
                    <div className="flex"> 
                        <Button loading={isLoading} disabled={data?.call.status!='activa'} type="primary" onClick={() => handleUpdateCall()}>Guardar</Button>
                    </div>

                    <Modal okText='Guardar' open={isOpen} onCancel={() => setIsOpen(false)} title='Agendar llamada'>
                        <div className="flex flex-row gap-4 mb-4">
                            <Select size="large" placeholder='Tipo de llamada' onChange={(value) => { }}>
                                {catalogs?.map((value, index) => <Select.Option key={`${index}`} value={`${index}`}>{capitalizeFirstLetter(value.name)}</Select.Option>)}
                            </Select>

                            <DatePicker
                                size="large" placeholder="Fecha" style={{ minWidth: 200 }} />
                        </div>
                    </Modal>
                </div>
            }
        />
    );
}
export default CallInfo;
import { Button, DatePicker, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CallCatalog } from "../../data/call/call.catalog";
import { RegisterCallRequest } from "../../data/call/call.request";
import { useGetCatalogsMutation, useRegisterCallMutation } from "../../services/callService";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";

interface RegisterCallProps {
    patientId?: number;
    appointmentId?: number;
}

const RegisterCall = (props: RegisterCallProps) => {
    const [getCatalogs] = useGetCatalogsMutation();
    const [registerCall] = useRegisterCallMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [catalogs, setCatalogs] = useState<CallCatalog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        handleGetCallCatalogs();
    }, [])

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

    const handleRegisterCall = async () => {
        try {
            await registerCall(
                new RegisterCallRequest(props.patientId ?? 0, comment, props.appointmentId ?? 0, date, type)
            ).unwrap();
            setIsLoading(false);
            setIsOpen(false);
            setDate('');
            setType('');
            setComment('');
            handleSucccessNotification(NotificationSuccess.REGISTER);
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <div className="flex w-full gap-2 mb-2 mt-4">
                        <Button type="dashed" onClick={() => setIsOpen(true)}>Registrar llamada</Button>
                    </div>
                    <Modal confirmLoading={isLoading} okText='Guardar' open={isOpen} onCancel={() => setIsOpen(false)} title='Registrar nueva llamada' onOk={() => handleRegisterCall()}>
                        <div className="flex flex-row gap-4 mb-4 mt-4">
                            <Select style={{minWidth:200}} size="large" placeholder='Tipo de llamada' onChange={(value) => setType(value)}>
                                {catalogs?.map((value, _) => <Select.Option key={`${value.id}`} value={`${value.id}`}>{capitalizeFirstLetter(value.name)}</Select.Option>)}
                            </Select>

                            <DatePicker
                                onChange={(event: any) => setDate(format(new Date(event), 'yyyy-MM-dd'))}
                                size="large" placeholder="Fecha" style={{ minWidth: 200 }} />
                        </div>
                        <TextArea
                            showCount
                            rows={6}
                            maxLength={150}
                            style={{ height: 120, marginBottom: 5 }}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="Detalle de la llamada"
                        />
                        <br />
                    </Modal>
                </div>
            }
        />
    );
}

export default RegisterCall;
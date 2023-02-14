import { Button, DatePicker, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { CallCatalog } from "../../data/call/call.catalog";
import { RegisterCallRequest } from "../../data/call/call.request";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import SelectItemOption from "../../data/select/select.item.option";
import { patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import User from "../../data/user/user";
import { useGetCatalogsMutation, useRegisterCallMutation } from "../../services/callService";
import { useGetPatientsMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter, getUserRol, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";


interface FormCallProps {
    onFinish: () => void;
    showPatients: boolean;
    patientId?: number;
}

const FormCall = (props: FormCallProps) => {
    const [getCatalogs] = useGetCatalogsMutation();

    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('');
    const [catalogList, setCatalogList] = useState<CallCatalog[]>([]);
    const [getPatients] = useGetPatientsMutation();
    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [registerCall] = useRegisterCallMutation();
    const [patient, setPatient] = useState<SelectItemOption>();
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const [session, setSession] = useSessionStorage(
        Constants.SESSION_AUTH,
        null
    );

    useEffect(() => {
        handleGetCallCatalogs();
        if (props.showPatients) {
            handleGetPatients();
        }
    }, [])

    const handleGetCallCatalogs = async () => {
        try {
            const response = await getCatalogs({}).unwrap();
            setCatalogList(response.filter((value, _) => value.type == 'manual'))
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }


    const handleGetPatients = async () => {
        try {
            const response = await getPatients(
                new FilterEmployeesRequest(DEFAULT_PATIENTS_ACTIVE)
            ).unwrap();
            if (getUserRol(session as User) == UserRoles.RECEPTIONIST) {
                setPatientList(patientsToSelectItemOption(response.filter((value, _) => value.originBranchOfficeId == Number(branchId))));
            } else {
                setPatientList(patientsToSelectItemOption(response));
            }
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }


    const handleRegisterCall = async () => {
        try {
            let patientId = 0;
            if (props.showPatients) {
                patientId = patient?.id ?? 0;
            } else {
                patientId = props.patientId ?? 0;
            }

            await registerCall(
                new RegisterCallRequest(
                    patientId,
                    comment,
                    date,
                    type
                )
            ).unwrap();
            setComment('');
            setDate('');
            setType('');
            setPatient(undefined);
            setIsOpen(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
            props?.onFinish();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <div className="flex w-full items-end justify-end">
                        <Button onClick={() => setIsOpen(true)} type="dashed">Registrar llamada</Button>
                    </div>

                    <Modal confirmLoading={false} okText='Guardar' open={isOpen} onCancel={() => setIsOpen(false)} title='Registrar nueva llamada' onOk={() => handleRegisterCall()}>
                        {props.showPatients && <SelectSearch
                            placeholder="Selecciona un paciente"
                            items={patientList}
                            onChange={(value) => setPatient(value)}
                            icon={<></>}
                        />}

                        <div className="flex flex-row gap-4 mb-4 mt-4">
                            <Select style={{ minWidth: 220 }} size="large" placeholder='Tipo de llamada' onChange={(value) => setType(value)}>
                                {catalogList?.map((value, _) => <Select.Option key={`${value.id}`} value={`${value.id}`}>{capitalizeFirstLetter(value.name)}</Select.Option>)}
                            </Select>

                            <DatePicker
                                onChange={(event: any) => setDate(format(new Date(event), 'yyyy-MM-dd'))}
                                size="large" placeholder="Fecha" style={{ minWidth: 220 }} />
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
export default FormCall;
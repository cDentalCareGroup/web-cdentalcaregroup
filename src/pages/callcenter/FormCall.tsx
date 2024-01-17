import { Button, DatePicker, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import useSessionStorage from "../../core/sessionStorage";
import { CallCatalog } from "../../data/call/call.catalog";
import { RegisterCallRequest } from "../../data/call/call.request";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem, patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import User from "../../data/user/user";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetCatalogsMutation, useRegisterCallMutation } from "../../services/callService";
import { useGetPatientsMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeAllCharacters, getUserRol, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";


interface FormCallProps {
    onFinish: () => void;
    showPatients: boolean;
    patientId?: number;
    prospectId?: number;
    callId?: number;
    appointmentId?: number;
}

const FormCall = (props: FormCallProps) => {
    const [getCatalogs] = useGetCatalogsMutation();

    const [isOpen, setIsOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

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
    const [branchOffices, setBranchOffices] = useState<SelectItemOption[]>([]);
    const [branchOffice, setBranchOffice] = useState<SelectItemOption>();

    const [session, setSession] = useSessionStorage(
        Constants.SESSION_AUTH,
        null
    );
    const [isProspect, setIsProspect] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [getBranchOffices] = useGetBranchOfficesMutation();

    useEffect(() => {
        handleGetCallCatalogs();
        if (props.showPatients) {
            handleGetPatients();
        }
    }, [])

    const handleGetCallCatalogs = async () => {
        try {
            const response = await getCatalogs({}).unwrap();
            setCatalogList(response.filter((value, _) => value.type == Constants.STATUS_MANUAL))
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            console.log(response);
            setBranchOffices(branchOfficesToSelectOptionItem(response));
        } catch (error) {
            console.log(error);
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

            if (date == '' || date == undefined || date == null) {
                handleErrorNotification(Constants.SET_TEXT, `Debes agregar una fecha`)
                return;
            }
            if (type == '' || type == null || type == undefined) {
                handleErrorNotification(Constants.SET_TEXT, `Debes agregar un tipo de llamada`)
                return;
            }

            setIsActionLoading(true);
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
                    type,
                    name, phone, email, props?.prospectId ?? 0, props?.callId ?? 0, props?.appointmentId ?? 0,
                    branchOffice?.id ?? 0
                )
            ).unwrap();
            setComment('');
            setDate('');
            setType('');
            setName('');
            setEmail('');
            setPhone('');
            setPatient(undefined);
            setIsOpen(false);
            setIsActionLoading(false);
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
                        <Button size="small" onClick={() => setIsOpen(true)} type="dashed">{Strings.registerCall}</Button>
                    </div>

                    <Modal confirmLoading={isActionLoading} okText={Strings.save} open={isOpen} onCancel={() => setIsOpen(false)} title={Strings.registerNewCall} onOk={() => handleRegisterCall()}>
                        {(props.showPatients && !isProspect) && <SelectSearch
                            placeholder={Strings.selectPatient}
                            items={patientList}
                            onChange={(value) => setPatient(value)}
                            icon={<></>}
                        />}

                        {(props.showPatients && isProspect) &&
                            <div className="flex flex-col">
                                <span className="flex mb-2">Sucursal prospecto</span>
                                <SelectSearch
                                    placeholder={Strings.selectBranchOffice}
                                    items={branchOffices}
                                    onChange={(event) => setBranchOffice(event)}
                                    icon={<></>}
                                />
                                <CustomFormInput label={Strings.patientName} value={name} onChange={(value) => setName(value)} />
                                <CustomFormInput label={Strings.phoneNumber} value={phone} onChange={(value) => setPhone(value)} />
                                <CustomFormInput label={Strings.email} value={email} onChange={(value) => setEmail(value)} />
                            </div>}


                        {props.showPatients && <div className="flex flex-col items-end justify-end">
                            <Button onClick={() => {
                                if (!isProspect && branchOffices.length == 0) {
                                    handleGetBranchOffices()
                                }
                                setIsProspect(!isProspect)
                            }} type="link">
                                {`${isProspect ? Strings.selectPatient : Strings.registerProspect}`}
                            </Button>
                        </div>}

                        <div className="flex flex-row gap-4 mb-4 mt-4">
                            <Select style={{ minWidth: 220 }} size="large" placeholder={Strings.callType} onChange={(value) => setType(value)}>
                                {catalogList?.map((value, _) => <Select.Option key={`${value.id}`} value={`${value.id}`}>{capitalizeAllCharacters(value.name)}</Select.Option>)}
                            </Select>

                            <DatePicker
                                onChange={(event: any) => setDate(format(new Date(event), 'yyyy-MM-dd'))}
                                size="large" placeholder={Strings.date} style={{ minWidth: 220 }} />
                        </div>
                        <TextArea
                            showCount
                            rows={6}
                            maxLength={150}
                            style={{ height: 120, marginBottom: 5 }}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder={Strings.callDetail}
                        />
                        <br />
                    </Modal>
                </div>
            }
        />
    );
}
export default FormCall;
import { Button, Card, Radio, Row, Space, Tag } from "antd";
import Search from "antd/es/input/Search";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { RiHashtag, RiMailLine, RiPhoneLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { DEFAULT_FILTERS } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { Patient } from "../../data/patient/patient";
import { buildPatientEmail, buildPatientName, buildPatientPhone } from "../../data/patient/patient.extensions";
import { UpdatePatientStatusRequest } from "../../data/patient/patient.request";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem } from "../../data/select/select.item.option.extensions";
import User from "../../data/user/user";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetPatientsByBranchOfficeMutation, useGetPatientsMutation, useUpdatePatientStatusMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { isAdmin, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";

interface PatientsProps {
    rol: UserRoles;
}


const Patients = (props: PatientsProps) => {

    const [getPatientsByBranchOffice] = useGetPatientsByBranchOfficeMutation();
    const [getPatients] = useGetPatientsMutation();

    const [updatePatientStatus] = useUpdatePatientStatusMutation();
    const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);
    const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, 0);
    const [patientList, setPatientList] = useState<Patient[]>([]);
    const [data, setData] = useState<Patient[]>([]);
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient>();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');


    useEffect(() => {
        if (session != null) {
            const user = session as User;
            if (isAdmin(user)) {
                handleGetAllPatients();
            } else {
                handleGetPatients();
            }
        }
    }, []);

    const handleGetPatients = async () => {
        try {
            setIsLoading(true);
            const response = await getPatientsByBranchOffice(Number(branchId)).unwrap();
            setPatientList(response);
            setData(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }



    const handleGetAllPatients = async () => {
        try {
            setIsLoading(true);
            const response = await getPatients(new FilterEmployeesRequest([DEFAULT_FILTERS[3]])).unwrap();
            setPatientList(response);
            setData(response);
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setPatientList(data);
        }
        const res = data?.filter((value) =>
            buildPatientName(value)
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setPatientList(res);
    }


    const handleUpdatePatientStatus = async () => {
        try {
            await updatePatientStatus(new UpdatePatientStatusRequest(patient?.id ?? 0, status)).unwrap();
            setIsOpen(false);
            handleGetPatients();
            setStatus('');
            setPatient(undefined);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const getStautsTag = (data: Patient): JSX.Element => {
        if (data?.status == 'activo') {
            return <Tag color="success">{data.status}</Tag>
        }
        if (data?.status == 'inactivo') {
            return <Tag color="default">{data.status}</Tag>
        }
        if (data?.status == 'deshabilitado') {
            return <Tag color="error">{data.status}</Tag>
        }
        return <></>;
    }

    return (<LayoutCard title={Strings.patients} isLoading={isLoading} content={
        <div className="flex flex-col">
            <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchPatient} onSearch={handleOnSearch} enterButton />
            <div className="flex w-full items-end justify-end mt-4 mb-12">
                <Button type="primary" onClick={() => {
                    if (props.rol == UserRoles.ADMIN) {
                        navigate('/admin/patients/register')
                    } else {
                        navigate('/receptionist/patients/register')
                    }
                }}>{Strings.registerPatient}</Button>
            </div>
            <Row>
                {patientList.map((value, index) =>
                    <Card key={index} title={buildPatientName(value)} className="m-2 cursor-pointer" actions={[
                        <Button type="dashed" onClick={() => {
                            setPatient(value);
                            setIsOpen(true);
                        }} danger>{'Estatus'}</Button>,
                        <Button type="dashed" onClick={() => {
                            if (props.rol == UserRoles.ADMIN) {
                                navigate(`/admin/patients/detail/${value.id}`)
                            } else {
                                navigate(`/receptionist/patients/detail/${value.id}`)
                            }
                        }}>{Strings.seeInfo}</Button>

                    ]}>
                        <SectionElement label={Strings.patientId} value={`${value.id}`} icon={<RiHashtag />} />
                        <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(value)} icon={<RiPhoneLine />} />
                        <SectionElement label={Strings.email} value={buildPatientEmail(value)} icon={<RiMailLine />} />
                        {getStautsTag(value)}
                    </Card>
                )}
            </Row>

            <Modal open={isOpen} onOk={() => handleUpdatePatientStatus()} onCancel={() => setIsOpen(false)} title={`Eliminar paciente ${buildPatientName(patient)}`} okText={Strings.save}>
                <Radio.Group onChange={(event) => setStatus(event.target.value)} value={status}>
                    <Space direction="vertical">
                        {patient?.status != 'activo' && <Radio value={'activo'}>Activo</Radio>}
                        <Radio value={'inactivo'}>Inactivo</Radio>
                        <Radio value={'deshabilitado'}>Deshabilitado</Radio>
                    </Space>
                </Radio.Group>
            </Modal>
        </div>
    } />);
}

export default Patients;
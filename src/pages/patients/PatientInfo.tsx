import { Divider, Table, Tabs, Tag } from "antd";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFileList3Line, RiFunctionLine, RiHeartPulseLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine, RiVipDiamondLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { PadData, Patient } from "../../data/patient/patient";
import {  DEFAULT_FIELD_VALUE, padComponentsToDataTable } from "../../data/patient/patient.extensions";
import { useGetPatientMutation } from "../../services/patientService";
import { formatNumberToPercent, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormPatient, { FormPatientType, FormPatientSource } from "./FormPatient";
import PatientPaymentAccountInfo from "./PatientPaymentAccountInfo";
import PatientHistory from "./PatientHistory";

interface PatientInfoProps {
    rol: UserRoles;
}

const PatientInfo = (props: PatientInfoProps) => {
    const { id } = useParams();
    const [getPatient, { isLoading }] = useGetPatientMutation();
    const [data, setData] = useState<Patient>();
    const [pad, setPad] = useState<PadData>();
    const [dataTable, setDataTable] = useState<any[]>([]);

    useEffect(() => {
        handleGetPatient();
    }, []);


    const handleGetPatient = async () => {
        try {
            const response = await getPatient({ patientId: id }).unwrap();
            setData(response.patient);
            setPad(response.pad);
            if (response.pad != null) {
                setDataTable(padComponentsToDataTable(response.pad.component!))
            }
        } catch (error) {
            handleErrorNotification(error);
        }
    }



    const columns = [
        {
            title: Strings.service,
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: Strings.discount,
            dataIndex: 'discount',
            key: 'discount',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span>{formatNumberToPercent(value.discount)}</span>
                </div>
            ),
        },
        {
            title: Strings.discountTwo,
            dataIndex: 'discountTwo',
            key: 'discountTwo',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span>{formatNumberToPercent(value.discount)}</span>
                </div>
            ),
        },
        {
            title: Strings.maxQuantity,
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: Strings.maxPatientQuantity,
            dataIndex: 'quantityPatient',
            key: 'quantityPatient',
        },
    ];


    const PatientPadCard = () => {
        return (<>
            <SectionElement label={Strings.padName} value={
                `${pad?.padCatalog?.name ?? DEFAULT_FIELD_VALUE}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.padType} value={
                `${pad?.padCatalog?.type ?? DEFAULT_FIELD_VALUE}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.adquisitionDate} value={
                `${pad?.pad?.padAdquisitionDate ?? DEFAULT_FIELD_VALUE}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.dueDate} value={
                `${pad?.pad?.padDueDate ?? DEFAULT_FIELD_VALUE}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.validDays} value={
                `${pad?.padCatalog?.day ?? DEFAULT_FIELD_VALUE}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.daysDueDate} value={
                `${differenceInDays(new Date(pad?.pad?.padDueDate ?? ''), new Date(pad?.pad?.padAdquisitionDate ?? ''))}`
            } icon={<RiUserHeartLine />} />
            {getStautsTag()}

            <Divider> {Strings.padBenefits}</Divider>
            <Table dataSource={dataTable} columns={columns} />;

        </>);
    }


    const getStautsTag = (): JSX.Element => {
        if (pad?.pad?.status == Strings.statusValueActive) {
            return <Tag color="success">{pad?.pad?.status}</Tag>
        } else {
            return <Tag color="error">Inactivo</Tag>
        }
    }

    const tabs: any[] = [
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiFileList3Line /><span className="text text-sm">{Strings.patientInformation}</span></div>,
            key: 1,
            children: <FormPatient source={FormPatientSource.FORM} rol={props.rol} type={FormPatientType.UPDATE} patient={data} />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiVipDiamondLine /><span className="text text-sm">{Strings.membership}</span></div>,
            key: 2,
            children: <PatientPadCard />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiHeartPulseLine /><span className="text text-sm">Estado de cuenta</span></div>,
            key: 3,
            children: <PatientPaymentAccountInfo patient={data!} />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiCalendar2Line /><span className="text text-sm">Historial del paciente</span></div>,
            key: 4,
            children: <PatientHistory patient={data!} />,
        },
    ];

    return (
        <LayoutCard showBack={true} isLoading={isLoading} content={
            <div className="flex flex-col">
                {(data != null && data != undefined && isLoading == false) && <Tabs
                    size="large"
                    type="card"
                    items={tabs}
                />}
            </div>
        } />);
}

export default PatientInfo;
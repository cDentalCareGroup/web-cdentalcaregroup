import { Divider, Table, Tabs, Tag } from "antd";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFileList3Line, RiFunctionLine, RiHeartPulseLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine, RiVipDiamondLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { padCatalogueDetailToDataTable } from "../../data/pad/pad.extensions";
import { PadData, Patient } from "../../data/patient/patient";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPad, buildPatientPhone, buildPatientStartedAt, padComponentsToDataTable } from "../../data/patient/patient.extensions";
import { useGetPatientMutation } from "../../services/patientService";
import { capitalizeFirstLetter, formatNumberToPercent, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormPatient, { FormPatientType } from "./FormPatient";

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
            title: 'Servicio',
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: 'Descuento',
            dataIndex: 'discount',
            key: 'discount',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span>{formatNumberToPercent(value.discount)}</span>
                </div>
            ),
        },
        {
            title: 'Cantidad máxima',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];


    const PatientPadCard = () => {
        return (<>
            <SectionElement label={'Nombre del PAD'} value={
                `${pad?.padCatalog?.name}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={'Tipo de PAD'} value={
                `${pad?.padCatalog?.type}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={'Fecha de adquisición'} value={
                `${pad?.pad?.padAdquisitionDate}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={'Fecha de vencimiento'} value={
                `${pad?.pad?.padDueDate}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={'Días válido'} value={
                `${pad?.padCatalog?.day}`
            } icon={<RiUserHeartLine />} />
            <SectionElement label={'Días para el vencimiento del PAD'} value={
                `${differenceInDays(new Date(pad?.pad?.padDueDate ?? ''), new Date(pad?.pad?.padAdquisitionDate ?? ''))}`
            } icon={<RiUserHeartLine />} />
            {getStautsTag()}

            <Divider >Beneficios del PAD</Divider>
            <Table dataSource={dataTable} columns={columns} />;

        </>);
    }


    const getStautsTag = (): JSX.Element => {
        if (pad?.pad?.status == 'activo') {
            return <Tag color="success">{pad?.pad?.status}</Tag>
        } else {
            return <Tag color="error">Inactivo</Tag>
        }
    }

    const tabs: any[] = [
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiFileList3Line /><span className="text text-sm">{Strings.patientInformation}</span></div>,
            key: 1,
            children: <FormPatient rol={props.rol} type={FormPatientType.UPDATE} patient={data} />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiVipDiamondLine /><span className="text text-sm">{Strings.membership}</span></div>,
            key: 2,
            children: <PatientPadCard />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiHeartPulseLine /><span className="text text-sm">{Strings.medicalRecord}</span></div>,
            key: 3,
            children: <NoData />,
        },
    ];

    return (
        <LayoutCard showBack={true} isLoading={isLoading} content={
            <div className="flex flex-col">
                {data && <Tabs
                    size="large"
                    type="card"
                    items={tabs}
                />}
            </div>
        } />);
}

export default PatientInfo;
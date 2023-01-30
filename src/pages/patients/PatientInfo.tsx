import {  Tabs } from "antd";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFileList3Line, RiFunctionLine, RiHeartPulseLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine, RiVipDiamondLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { Patient } from "../../data/patient/patient";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPad, buildPatientPhone, buildPatientStartedAt } from "../../data/patient/patient.extensions";
import { useGetPatientMutation } from "../../services/patientService";
import { UserRoles } from "../../utils/Extensions";
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

    useEffect(() => {
        handleGetPatient();
    }, []);


    const handleGetPatient = async () => {
        try {
            const response = await getPatient({ patientId: id }).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const PatientPadCard = () => {
        return (<>
            <SectionElement label={Strings.pad} value={buildPatientPad(data)} icon={<RiUserHeartLine />} />
        </>);
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
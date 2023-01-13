import { Divider, Tabs, Tag } from "antd";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFileList3Line, RiFunctionLine, RiHeartPulseLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine, RiVipDiamondLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { Patient } from "../../data/patient/patient";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPad, buildPatientPhone, buildPatientStartedAt } from "../../data/patient/patient.extensions";
import { useGetPatientMutation } from "../../services/patientService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutTitle from "../components/LayoutTitle";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";

const PatientInfo = () => {
    const { id } = useParams();
    const [getPatient,{isLoading}] = useGetPatientMutation();
    const [data, setData] = useState<Patient>();

    useEffect(() => {
        handleGetPatient();
    }, []);


    const handleGetPatient = async () => {
        try {
            const response = await getPatient({ patientId: id }).unwrap();
            console.log(response);
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const PatientContentInfo = () => {
        return (<div className="flex flex-col mt-6">
            <SectionElement label={Strings.patientName} value={buildPatientName(data)} icon={<RiUser3Line />} />
            <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(data)} icon={<RiPhoneLine />} />
            <SectionElement label={Strings.birthday} value={buildPatientBirthday(data)} icon={<RiCalendar2Line />} />
            <SectionElement label={Strings.gender} value={buildPatientGender(data)} icon={<RiUser3Line />} />
            <SectionElement label={Strings.email} value={buildPatientEmail(data)} icon={<RiMailLine />} />
            <SectionElement label={Strings.address} value={buildPatientAddress(data)} icon={<RiFunctionLine />} />
            <SectionElement label={Strings.pad} value={buildPatientPad(data)} icon={<RiUserHeartLine />} />
            <SectionElement label={Strings.patientSince} value={buildPatientStartedAt(data)} icon={<RiCalendar2Line />} />
        </div>);
    }

    const tabs: any[] = [
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiFileList3Line /><span className="text text-sm">Informacion del paciente</span></div>,
            key: 1,
            children: <PatientContentInfo />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiVipDiamondLine /><span className="text text-sm">Membresia Pad</span></div>,
            key: 2,
            children: <NoData />,
        },
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiHeartPulseLine /><span className="text text-sm">Ficha medica</span></div>,
            key: 3,
            children: <NoData />,
        },
    ];

    return (
        <LayoutCard  showBack={true} title={`Paciente - ${buildPatientName(data)}`} isLoading={isLoading} content={
            <div className="flex flex-col">
                <Tabs
                    size="large"
                    type="card"
                    items={tabs}
                />
            </div>
        } />);
}

export default PatientInfo;
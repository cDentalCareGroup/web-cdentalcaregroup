import { Button, Divider, Tag } from "antd";
import { RiCalendar2Line, RiFunctionLine, RiMailLine, RiMentalHealthLine, RiPhoneLine, RiSearch2Line, RiStethoscopeLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import Strings from "../../utils/Strings";
import BackArrow from "../components/BackArrow";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import {
    WhatsAppOutlined,
    MailFilled
} from '@ant-design/icons';
import { useGetAppointmentInfoMutation } from "../../services/appointmentService";
import { useEffect, useState } from "react";
import { handleErrorNotification } from "../../utils/Notifications";
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { getHasLabs, getPatientAddress, getPatientBirthDay, getPatientEmail, getPatientGender, getPatientName, getPatientPad, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import { getAppointmentDate, getAppointmentDentist, getAppointmentFolio, getAppointmentStatus } from "../../data/appointment/appointment.extensions";
import AppointmentCard from "./components/AppointmentCard";
const AppointmentInfo = () => {
    const { folio } = useParams();
    const [getAppointmentInfo, { isLoading }] = useGetAppointmentInfoMutation();
    const [data, setData] = useState<AppointmentDetail>();

    useEffect(() => {
        handleGetAppointmentInfo();
    }, []);

    const handleGetAppointmentInfo = async () => {
        try {
            const response = await getAppointmentInfo({ folio: folio }).unwrap();
            setData(response.appointment);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard showBack={true} title={`${Strings.appointment} - ${getPatientName(data)} - ${getAppointmentDate(data)}`} isLoading={isLoading} content={
            <div className="flex flex-col">
                               <div className="flex w-full flex-wrap items-baseline">
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.patientInformation}</span>
                        <SectionElement label={Strings.patientName} value={getPatientName(data)} icon={<RiUser3Line />} />
                        <SectionElement label={Strings.phoneNumber} value={getPatientPrimaryContact(data)} icon={<RiPhoneLine />} />
                        <SectionElement label={Strings.birthday} value={getPatientBirthDay(data)} icon={<RiCalendar2Line />} />
                        <SectionElement label={Strings.gender} value={getPatientGender(data)} icon={<RiUser3Line />} />
                        <SectionElement label={Strings.email} value={getPatientEmail(data)} icon={<RiMailLine />} />
                        <SectionElement label={Strings.address} value={getPatientAddress(data)} icon={<RiFunctionLine />} />
                        <SectionElement label={Strings.pad} value={getPatientPad(data)} icon={<RiUserHeartLine />} />
                        <div className="flex flex-row gap-2 items-center p-2">
                            <Tag onClick={() => {
                                window.open(`https://api.whatsapp.com/send/?phone=527772811293`, '_blank', 'noopener,noreferrer');
                            }} className="cursor-pointer" icon={<WhatsAppOutlined />} color="#25D366">
                                {Strings.whatsapp}
                            </Tag>
                            <Tag onClick={() => {
                                window.open(`mailto:imanueld22@gmail.com`, '_blank', 'noopener,noreferrer');
                            }} className="cursor-pointer" icon={<MailFilled />} color="#55acee">
                                {Strings.email}
                            </Tag>
                        </div>
                    </div>
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.branchOfficeInformacion}</span>
                        <SectionElement label={Strings.folio} value={getAppointmentFolio(data)} icon={<RiSearch2Line />} />
                        <SectionElement label={Strings.dentist} value={getAppointmentDentist(data)} icon={<RiMentalHealthLine />} />
                        <SectionElement label={Strings.hasLabs} value={getHasLabs(data)} icon={<RiStethoscopeLine />} />
                        <SectionElement label={Strings.dateAndTime} value={getAppointmentDate(data)} icon={<RiCalendar2Line />} />
                        <SectionElement label={Strings.status} value={getAppointmentStatus(data)} icon={<RiFunctionLine />} />

                    </div>

                    <Divider />
                    <div className="flex w-full items-center justify-center overflow-hidden">
                        {data != null && <AppointmentCard hideContent={true} appointment={data} onStatusChange={() => { }} onAppointmentChange={(event) => setData(event)} />}

                    </div>
                </div>
            </div>
        } />
    );
}

export default AppointmentInfo;
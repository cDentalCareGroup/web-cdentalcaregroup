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
const AppointmentInfo = () => {
    const { folio } = useParams();
    const [getAppointmentInfo] = useGetAppointmentInfoMutation();
    const [data, setData] = useState<AppointmentDetail>();

    useEffect(() => {
        handleGetAppointmentInfo();
    },[]);

    const handleGetAppointmentInfo = async () => {
        try {
            const response = await getAppointmentInfo({folio: folio}).unwrap();
            console.log(response);
            setData(response.appointment);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard isLoading={false} content={
            <div className="flex flex-col">
                <BackArrow />
                <h2 className="text-2xl font-bold text-[#00152A]  mb-2 w-full ml-4">
                    Cita - Ana Cecilia Casillas - 2023-01-13 17:00:00
                </h2>
                <Divider />
                <div className="flex w-full flex-wrap items-baseline">
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.patientInformation}</span>
                        <SectionElement label={Strings.patientName} value={'getPatientName(data)'} icon={<RiUser3Line />} />
                        <SectionElement label={Strings.phoneNumber} value={'getPatientPrimaryContact(data)'} icon={<RiPhoneLine />} />
                        <SectionElement label={'Fecha nacimiento'} value={'getPatientPrimaryContact(data)'} icon={<RiCalendar2Line />} />
                        <SectionElement label={'Genero'} value={'getPatientPrimaryContact(data)'} icon={<RiUser3Line />} />
                        <SectionElement label={Strings.email} value={'getPatientEmail(data)'} icon={<RiMailLine />} />
                        <SectionElement label={'Direccion'} value={'getPatientPrimaryContact(data)'} icon={<RiFunctionLine />} />
                        <SectionElement label={'Pad'} value={'getPatientPrimaryContact(data)'} icon={<RiUserHeartLine />} />

                        <SectionElement label={Strings.dateAndTime} value={`datee`} icon={<RiCalendar2Line />} />

                        <div className="flex flex-row gap-2 items-center p-2">
                            <Tag onClick={() => {
                                window.open(`https://api.whatsapp.com/send/?phone=527772811293`, '_blank', 'noopener,noreferrer');
                            }} className="cursor-pointer" icon={<WhatsAppOutlined />} color="#25D366">
                                Whatsapp
                            </Tag>
                            <Tag onClick={() => {
                                window.open(`mailto:imanueld22@gmail.com`, '_blank', 'noopener,noreferrer');
                            }} className="cursor-pointer" icon={<MailFilled />} color="#55acee">
                                Correo electronico
                            </Tag>
                        </div>
                    </div>
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.branchOfficeInformacion}</span>
                        <SectionElement label={'Folio'} value={'getBranchOfficeName(data)'} icon={<RiSearch2Line />} />
                        <SectionElement label={'Dentista'} value={'getBranchOfficePhone(data)'} icon={<RiMentalHealthLine />} />
                        <SectionElement label={'Labs'} value={'getBranchOfficeEmail(data)'} icon={<RiStethoscopeLine />} />
                        <SectionElement label={'Fecha y hora'} value={'getBranchOfficeAddress(data)'} icon={<RiCalendar2Line />} />
                        <SectionElement label={'Status'} value={'getBranchOfficeAddress(data)'} icon={<RiFunctionLine />} />

                    </div>
                </div>
            </div>
        } />
    );
}

export default AppointmentInfo;
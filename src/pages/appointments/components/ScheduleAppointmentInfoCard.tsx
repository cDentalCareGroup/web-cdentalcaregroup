import { dayName, monthName } from "../../../utils/Extensions";
import SectionElement from "../../components/SectionElement";
import { RiCalendar2Line, RiHospitalLine, RiMailLine, RiMentalHealthLine, RiPhoneLine } from "react-icons/ri";
import Strings from "../../../utils/Strings";

interface ScheduleAppointmentInfoCardProps {
    name: string | undefined;
    primaryContact: string | undefined;
    email?: string;
    date: Date;
    time: string | undefined;
    branchOfficeName: string | undefined;
    dentist?: string | undefined;
}

const ScheduleAppointmentInfoCard = ({ name, primaryContact, email, date, time, branchOfficeName, dentist }: ScheduleAppointmentInfoCardProps) => {


    const getTime = () => {
        return time?.split(" ")[0];
    }

    return (
        <div className="flex transition-all flex-col bg-gray-50 rounded-md p-2 text-gray-500">
            <span className="text-gray-700 text-2xl font-semibold flex">Resumen de la cita</span>
            <SectionElement label={Strings.patientName} value={`${name}`} icon={<RiMentalHealthLine />} />
            <SectionElement label={Strings.phoneNumber} value={`${primaryContact}`} icon={<RiPhoneLine />} />
            {email && <SectionElement label={Strings.email} value={email} icon={<RiMailLine />} />}
            <SectionElement label={Strings.dateAndTime}
                value={`${dayName(date)} ${date.getDate()} ${monthName(date)} ${date.getFullYear()}, ${getTime()}`}
                icon={<RiCalendar2Line />} />
            <SectionElement label={Strings.branchOffice} value={`${branchOfficeName}`} icon={<RiHospitalLine />} />
            {dentist && <SectionElement label="Dentista / Especialista" value={dentist} icon={<RiHospitalLine />} />
            }
        </div>
    );
}

export default ScheduleAppointmentInfoCard;
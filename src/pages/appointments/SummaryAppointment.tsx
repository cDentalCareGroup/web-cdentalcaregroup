import { Button, Divider } from "antd";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFunctionLine, RiMailLine, RiMentalHealthLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { getBranchOfficeAddress, getBranchOfficeEmail, getBranchOfficeName, getBranchOfficePhone } from "../../data/branchoffice/branchoffice.extensions";
import { getPatientEmail, getPatientName, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import { useGetAppointmentDetailPatientMutation } from "../../services/appointmentService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import QrCode from "../components/QrCode";
import SectionElement from "../components/SectionElement";
import TopBarHeader from "../components/TopBarHeader";
import LayoutCard from "../layouts/LayoutCard";

const SummaryAppointment = () => {

    const [getAppointmentDetail, { isLoading, isError }] = useGetAppointmentDetailPatientMutation();
    const { folio } = useParams();
    const [data, setData] = useState<AppointmentDetail | undefined>();
    const navigation = useNavigate();


    useEffect(() => {
        handleGetAppointmentDetail();
    }, []);

    const handleGetAppointmentDetail = async () => {
        try {
            const response = await getAppointmentDetail({ folio: folio }).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard isError={isError} isLoading={isLoading} center={true} content={
            <div className="flex flex-col w-full h-full">
                <TopBarHeader title= {Strings.appointmentSummary} />
                <Divider />
                <div className="flex w-full lg:mt-12 flex-wrap items-baseline lg:justify-center lg:gap-24">
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.patientInformation}</span>
                        <SectionElement label={Strings.patientName} value={getPatientName(data)} icon={<RiUser3Line />} />
                        <SectionElement label={Strings.phoneNumber} value={getPatientPrimaryContact(data)} icon={<RiPhoneLine />} />
                        <SectionElement label={Strings.email} value={getPatientEmail(data)} icon={<RiMailLine />} />
                        <SectionElement label={Strings.dateAndTime} value={`${data?.appointment.appointment} ${data?.appointment.time}`} icon={<RiCalendar2Line />} />
                    </div>
                    <div className="p-4">
                        <span className="text-2xl text-gray-500 font-semibold mb-4 flex">{Strings.branchOfficeInformacion}</span>
                        <SectionElement label={Strings.branchOffice} value={getBranchOfficeName(data)} icon={<RiMentalHealthLine />} />
                        <SectionElement label={Strings.phoneNumberBranchOffice} value={getBranchOfficePhone(data)} icon={<RiPhoneLine />} />
                        <SectionElement label={Strings.email} value={getBranchOfficeEmail(data)} icon={<RiMailLine />} />
                        <SectionElement label={Strings.address} value={getBranchOfficeAddress(data)} icon={<RiFunctionLine />} />
                        <div className="flex w-full items-end justify-end">
                            <Link
                                to='#'
                                onClick={(e) => {
                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${data?.branchOffice.lat},${data?.branchOffice.lng}`,
                                        '_blank', 'noopener,noreferrer');
                                    e.preventDefault();
                                }}>
                                <Button type="link" size="small">Ver en google maps</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex w-full items-center justify-center flex-col flex-wrap">
                    <QrCode value="asda" />
                    <div className="flex flex-col flex-wrap mt-16 p-4">
                        <p className="text-xs text-gray-500">Para descargar da click en el boton "Descargar QR" o toma una captura de pantalla al código QR</p>
                        <p className="text-xs text-gray-500">Es importante que lleves tu código QR en tu teléfono celular como captura de pantalla o el PDF electrónico.</p>
                        <p className="text-xs text-gray-500">Cuando llegues a tu cita recuerda mostrar el código QR a la recepcionista.</p>
                    </div>

                    <Divider />
                    <div className="flex flex-row items-baseline flex-wrap gap-6 mb-6">
                        <Button danger type="dashed" target="_blank" onClick={() => {
                            navigation(`/appointment/cancel/${data?.appointment.folio}`)
                        }}>{Strings.cancelAppointment}</Button>
                        <Button>{Strings.rescheduleAppointment}</Button>
                    </div>
                </div>
            </div>
        } />
    );
}

export default SummaryAppointment;
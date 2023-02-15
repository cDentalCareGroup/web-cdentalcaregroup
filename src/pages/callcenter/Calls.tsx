import { Button, Card, List, Modal, Row, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/skeleton/Paragraph";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { Call } from "../../data/call/call";
import { CallCatalog } from "../../data/call/call.catalog";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientEmail, buildPatientName, buildPatientPad, buildPatientPhone } from "../../data/patient/patient.extensions";
import { useGetCallsMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import FormAppointment from "../appointments/FormAppointment";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormCall from "./FormCall";

const Calls = () => {
    const [getCalls, { isLoading }] = useGetCallsMutation();
    const [data, setData] = useState<GetCalls[]>([]);
    const navigate = useNavigate();

    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );

    useEffect(() => {
        handleGetCalls();
    }, []);


    const handleGetCalls = async () => {
        try {
            const response = await getCalls({}).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const buildPriority = (call: Call) => {
        const diff = differenceInDays(new Date(call.dueDate), new Date());
        if (diff <= 0) {
            return <Tag color="red">Atender hoy</Tag>
        } else {
            return <Tag color="blue">{`Atender antes del ${call.dueDate}`}</Tag>
        }
    }


    const buildInfo = (value: GetCalls): JSX.Element => {
        if (value.patient != null && value.patient != undefined) {
            return (
                <div className="mb-2">
                    <SectionElement label={Strings.patientName} value={buildPatientName(value.patient)} icon={<RiUser3Line />} />
                    <SectionElement label={Strings.branchOffice} value={value.appointment?.branchName ?? ''} icon={<RiMailLine />} />
                    <SectionElement label={Strings.email} value={buildPatientEmail(value.patient)} icon={<RiMailLine />} />
                    <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(value.patient)} icon={<RiPhoneLine />} />
                    <Tag color="blue">Paciente</Tag>
                </div>
            );
        } else {
            return (
                <div className="mb-2">
                    <SectionElement label={Strings.patientName} value={value.propspect?.name ?? '-'} icon={<RiUser3Line />} />
                    <SectionElement label={Strings.branchOffice} value={'-'} icon={<RiMailLine />} />
                    <SectionElement label={Strings.email} value={value.propspect?.email ?? '-'} icon={<RiUser3Line />} />
                    <SectionElement label={Strings.phoneNumber} value={value.propspect?.primaryContact ?? '-'} icon={<RiPhoneLine />} />
                    <Tag>Prospecto</Tag>
                </div>
            );
        }
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            title={`${Strings.callsDay} ${data.length != 0 ? data.length : ''}`}
            content={
                <div className="flex flex-col">
                    <FormAppointment />
                    <br />
                    <FormCall showPatients={true} onFinish={() => handleGetCalls()} />

                    <div className="flex flex-row flex-wrap gap-2 mt-4">
                        {data.map((value, index) =>
                            <Card key={index} title={capitalizeFirstLetter(value.catalog.name)}
                                actions={[<span onClick={() => {
                                    setCall(value);
                                    navigate('/callcenter/call')
                                }}>{Strings.attend}</span>]}
                            >
                                {buildInfo(value)}
                                {buildPriority(value.call)}
                            </Card>
                        )
                        }
                        {data.length == 0 &&
                            <div className="flex flex-col items-center justify-center w-full">
                                <NoData />
                            </div>}
                    </div >
                </div>
            }
        />
    );

}

export default Calls;
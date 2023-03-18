import { Button, Card, List, Modal, Row, Tag } from "antd";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line, } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { Call } from "../../data/call/call";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientEmail, buildPatientName, buildPatientPhone } from "../../data/patient/patient.extensions";
import { useGetCallsMutation, useRegisterCallLogMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { capitalizeAllCharacters } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import FormAppointment from "../appointments/FormAppointment";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormCall from "./FormCall";
import { UserRoles } from "../../utils/Extensions";

const Calls = () => {
    const [getCalls, { isLoading }] = useGetCallsMutation();
    const [registerCallLog] = useRegisterCallLogMutation();
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
            let branchName = '-';
            if (value.catalog.name.toLowerCase() == 'no-show') {
                branchName = value.appointment?.branchName ?? '';
            } else {
                branchName = value.call?.branchName ?? '';
            }
            return (
                <div className="mb-2">
                    <SectionElement label={Strings.patientName} value={value.propspect?.name ?? '-'} icon={<RiUser3Line />} />
                    <SectionElement label={Strings.branchOffice} value={branchName} icon={<RiMailLine />} />
                    <SectionElement label={Strings.email} value={value.propspect?.email ?? '-'} icon={<RiUser3Line />} />
                    <SectionElement label={Strings.phoneNumber} value={value.propspect?.primaryContact ?? '-'} icon={<RiPhoneLine />} />
                    <Tag>Prospecto</Tag>
                </div>
            );
        }
    }

    const handleRegisterCallLog = async (id: number) => {
        try {
            const response = await registerCallLog({ 'id': id }).unwrap();
            console.log(response);
        } catch (error) {
            console.log(`handleRegisterCallLog`, error);
        }
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            title={`${Strings.callsDay} ${data.length != 0 ? data.length : ''}`}
            content={
                <div className="flex flex-col">
                    <FormAppointment rol={UserRoles.CALL_CENTER} />
                    <br />
                    <FormCall showPatients={true} onFinish={() => handleGetCalls()} />

                    <div className="flex flex-row flex-wrap gap-2 mt-4">
                        {data.map((value, index) =>
                            <Card key={index} title={capitalizeAllCharacters(value.catalog.name)}
                                actions={[<span onClick={() => {
                                    handleRegisterCallLog(value.call.id);
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
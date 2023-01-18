import { Button, Card, List, Modal, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import Paragraph from "antd/es/skeleton/Paragraph";
import { differenceInDays } from "date-fns";
import { useEffect, useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine } from "react-icons/ri";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { CallCatalog } from "../../data/call/call.catalog";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientEmail, buildPatientName, buildPatientPad, buildPatientPhone } from "../../data/patient/patient.extensions";
import { useGetCallsMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";

const Calls = () => {
    const [getCalls,{isLoading}] = useGetCallsMutation();
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


    const buildActions = (index: number, value: GetCalls): JSX.Element[] => {
        console.log(index)
        if (index == 0) {
            return [
                <span onClick={() => {
                    setCall(value);
                    navigate('/callcenter/call')
                }}>Atender</span>
            ]
        }
        return [];
    }
    return (
        <LayoutCard
            isLoading={isLoading}
            title={`Llamadas del día  ${data.length != 0 ? data.length : ''}`}
            content={
                <div className="flex flex-row flex-wrap gap-2">
                    {data.map((value, index) =>
                        <Card className={`${index != 0 ? "bg-gray-50":''}`} key={index} title={capitalizeFirstLetter(value.catalog.name)}
                            actions={buildActions(index, value)}
                        >
                            <SectionElement label={Strings.patientName} value={buildPatientName(value.patient)} icon={<RiUser3Line />} />
                            <SectionElement label={Strings.branchOffice} value={value.appointment?.branchName ?? ''} icon={<RiMailLine />} />
                            <SectionElement label={Strings.email} value={buildPatientEmail(value.patient)} icon={<RiMailLine />} />
                            <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(value.patient)} icon={<RiPhoneLine />} />
                        </Card>
                    )
                    }
                </div >
            }
        />
    );

}

export default Calls;
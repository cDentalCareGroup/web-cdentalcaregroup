import { useEffect, useState } from "react";
import { useGetAppointmentHistoryMutation } from "../../services/appointmentService"
import { handleErrorNotification } from "../../utils/Notifications"
import LayoutCard from "../layouts/LayoutCard"
import { Patient } from "../../data/patient/patient";
import { Appointment } from "../../data/appointment/appointment";
import { Timeline } from "antd";
import { getAppointmentStatus, getAppointmentStatusFromAppointment } from "../../data/appointment/appointment.extensions";
import NoData from "../components/NoData";



interface PatientHistoryProps {
    patient: Patient;
}

const PatientHistory = (props: PatientHistoryProps) => {

    const [getAppointmentHistory,{isLoading}] = useGetAppointmentHistoryMutation();
    const [data, setData] = useState<Appointment[]>([]);
    const [timelineData, setTimelineData] = useState<any[]>([])

    useEffect(() => {
        handleGetAppointmentHistory();
    }, []);


    const handleGetAppointmentHistory = async () => {
        try {
            const response = await getAppointmentHistory({
                'patientId': props.patient.id
            }).unwrap();
            setData(response);
            let newData: any[] = [];
            for (const item of response) {
                const comments = item.comments.split("\n").map((value, _) => value.trim())
                newData.push({
                    key: item.id,
                    color: `#001628`,
                    children: <div className="flex flex-col flex-wrap">
                        <span className="text-normal font-bold text-gray-600">{`Fecha y Hora: ${item.appointment} ${item.time}`}</span>
                        <span className="text-normal font-bold text-gray-600">{`Estatus: ${getAppointmentStatusFromAppointment(item)}`}</span>
                        {comments.map((value, index) => <span key={index} className="text-xs font-normal text-gray-500">{value}</span>)}
                    </div>

                });
            }
            setTimelineData(newData);
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }


    return (<LayoutCard title="Historial del paciente" isLoading={isLoading} content={
        <div className="flex w-full items-center justify-center">
            <Timeline
                items={timelineData}
                mode="alternate"
            />
            {isLoading == false && timelineData.length == 0 && <NoData />}
        </div>
    }
    />)
}

export default PatientHistory;
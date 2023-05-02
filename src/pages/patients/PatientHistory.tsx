import { useEffect, useState } from "react";
import { useGetAppointmentHistoryMutation } from "../../services/appointmentService"
import { handleErrorNotification } from "../../utils/Notifications"
import LayoutCard from "../layouts/LayoutCard"
import { Patient } from "../../data/patient/patient";
import { Appointment } from "../../data/appointment/appointment";
import { Timeline } from "antd";



interface PatientHistoryProps {
    patient: Patient;
}

const PatientHistory = (props: PatientHistoryProps) => {

    const [getAppointmentHistory] = useGetAppointmentHistoryMutation();
    const [data, setData] = useState<Appointment[]>([]);

    useEffect(() => {
        handleGetAppointmentHistory();
    }, []);


    const handleGetAppointmentHistory = async () => {
        try {
            const response = await getAppointmentHistory({
                'patientId': props.patient.id
            }).unwrap();
            setData(response);
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }
    const items = [{ children: 'sample', label: 'sample' }];


    return (<LayoutCard title="Historial de citas" isLoading={false} content={
        <></>
    }
     /> )
}

export default PatientHistory;
import { Button, Divider } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { CancelAppointmentRequest } from "../../data/appointment/appointment.request";
import { useCancelAppointmentMutation } from "../../services/appointmentService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import TopBarHeader from "../components/TopBarHeader";
import LayoutCard from "../layouts/LayoutCard";

const CancelAppointment = () => {
    const [reason, setReason] = useState('');
    const [cancelAppointment, { isLoading }] = useCancelAppointmentMutation();
    const [success, setSuccess] = useState(false);
    const { folio } = useParams();
    const navigate = useNavigate();

    const handleOnCancelAppointment = async () => {
        try {
            await cancelAppointment(new CancelAppointmentRequest(folio ?? '', reason)).unwrap();
            setSuccess(true);
        } catch (error) {
            setSuccess(false);
            handleErrorNotification(error);
        }
    }


    return (<LayoutCard isLoading={false} content={
        <div className="flex flex-col w-full h-full">
            <TopBarHeader title="Cancelar cita" />
            <Divider />
            <div className="flex w-full flex-wrap flex-col items-center justify-center">
                {!success && <div className="flex flex-col flex-wrap w-1/2 gap-6">
                    <TextArea
                        showCount
                        rows={6}
                        maxLength={150}
                        style={{ height: 120 }}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder={Strings.cancelationReason}
                    />
                    <div className="flex w-full items-end justify-end mt-4 mb-6">
                        <Button type="primary" danger loading={isLoading} htmlType="submit" onClick={() => handleOnCancelAppointment()}  >
                            {Strings.cancel}
                        </Button>
                    </div>

                </div>}

                {success && <div className="transition-all flex flex-col flex-wrap w-full h-screen">
                    <div className="flex flex-col items-center justify-center text-center mb-16">
                        <h2 className="text-2xl font-bold text-[#00152A] mb-2 w-full mt-4">
                            {Strings.successCancelAppointment}
                        </h2>
                        <RiCheckboxCircleLine className="text-[#00152A]" size={50} />
                    </div>
                    <div className="flex w-full items-center justify-center">
                        <Button type="primary" loading={false} onClick={() => navigate('/appointment', { replace: true })}>{Strings.scheduleNewAppointment}</Button>
                    </div>
                </div>}
            </div>
        </div>

    } />);
}

export default CancelAppointment;
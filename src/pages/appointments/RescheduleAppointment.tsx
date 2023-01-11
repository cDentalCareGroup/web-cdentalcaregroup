import { Button, Divider, Form, InputNumber } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { GetAppointmentAvailabilityRequest, RescheduleAppointmentRequest } from "../../data/appointment/appointment.request";
import { AvailableTime } from "../../data/appointment/available.time";
import { availableTimesToTimes } from "../../data/appointment/available.times.extensions";
import { getPatientEmail, getPatientName, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem } from "../../data/select/select.item.option.extensions";
import { useGetAppointmentAvailabilityMutation, useGetAppointmentDetailPatientMutation, useRescheduleAppointmentMutation } from "../../services/appointmentService";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { dayName } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import Calendar from "../components/Calendar";
import SelectSearch from "../components/SelectSearch";
import TopBarHeader from "../components/TopBarHeader";
import LayoutCard from "../layouts/LayoutCard";
import ScheduleAppointmentInfoCard from "./ScheduleAppointmentInfoCard";

const RescheduleAppointment = () => {

    const [getBranchOffices] = useGetBranchOfficesMutation();
    const [getAppointmentAvailability, { isLoading }] = useGetAppointmentAvailabilityMutation();
    const [getAppointmentDetail,] = useGetAppointmentDetailPatientMutation();
    const [rescheduleAppointment] = useRescheduleAppointmentMutation();

    const [branchOffices, setBranchOffices] = useState<SelectItemOption[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [date, setDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
    const [time, setTime] = useState<string>();
    const [branchOffice, setBranchOffice] = useState<SelectItemOption | null>(null);
    const scrollRef = useRef<any>(null)
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState<AppointmentDetail | undefined>();
    const { folio } = useParams();


    useEffect(() => {
        handleGetAppointmentDetail();
        handleGetBranchOffices();
    }, []);

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setBranchOffices(branchOfficesToSelectOptionItem(response));
        } catch (error) {
            console.log(error);
        }
    }
    const handleOnBranchOffice = async (event: SelectItemOption) => {
        setBranchOffice(event);
        handleGetAppointmentAvailability(date, event.label);
    }
    const handleOnDate = async (date: Date) => {
        handleGetAppointmentAvailability(date, branchOffice?.label ?? '');
    }
    const handleGetAppointmentAvailability = async (date: Date, branchOffice: string) => {
        try {
            const response = await getAppointmentAvailability(
                new GetAppointmentAvailabilityRequest(branchOffice.split('-')[0], dayName(date), date)).unwrap();
            setTimes(availableTimesToTimes(response));
            setDate(date);
            setAvailableTimes(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleRescheduleAppointment = async () => {
        try {
            setIsLoadingAction(true);
            const dateTime = availableTimes.find((value, _) => value.time == time);
            await rescheduleAppointment(
                new RescheduleAppointmentRequest(
                    data?.appointment.id ?? 0,
                    date,
                    dateTime,
                    branchOffice?.label.split("-")[0]
                )
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.RESCHEDULE_APPOINTMENT);
            setIsLoadingAction(false);
            navigate(`/appointment/detail/${data?.appointment.folio}`, {
                replace: true
            });
        } catch (error) {
            console.log(error);
            setIsLoadingAction(false);
            handleErrorNotification(error);
        }
    }

    const handleGetAppointmentDetail = async () => {
        try {
            const response = await getAppointmentDetail({ folio: folio }).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const validateFields = () => {
        return time != null
    }

    return (
        <LayoutCard isLoading={false} content={
            <div className="flex flex-col w-full h-full">
                <TopBarHeader title={Strings.rescheduleAppointment} />
                <Divider />
                <div className="flex w-full items-center justify-center mt-12 flex-wrap">
                    <div className="flex w-full items-center flex-col flex-wrap">
                        <div className="flex lg:w-1/3 w-full px-6 mb-12">
                            <SelectSearch
                                placeholder={Strings.selectBranchOffice}
                                items={branchOffices}
                                onChange={handleOnBranchOffice}
                                icon={<></>}
                            />
                        </div>

                        {branchOffice && <Calendar availableHours={times} handleOnSelectDate={handleOnDate} isLoading={isLoading} handleOnSelectTime={(value) => {
                            setTime(value);
                            window.scrollTo({ behavior: 'smooth', top: scrollRef.current.offsetTop })

                        }} />}

                        {(branchOffice && time) && <div className="flex flex-col lg:w-1/3 w-full px-6 mb-12 flex-wrap mt-12">
                            {validateFields() && <div className="mt-6 mb-6">
                                <ScheduleAppointmentInfoCard
                                    name={getPatientName(data)}
                                    primaryContact={getPatientPrimaryContact(data)}
                                    email={getPatientEmail(data)}
                                    date={date}
                                    time={time}
                                    branchOfficeName={branchOffice?.label.split('-')[0] ?? ''} />
                            </div>}
                            <div ref={scrollRef}></div>

                            <div className="flex">
                                <Button type="primary" loading={isLoadingAction} onClick={() => handleRescheduleAppointment()}>
                                    {Strings.rescheduleAppointment}
                                </Button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        } />
    );
}

export default RescheduleAppointment;
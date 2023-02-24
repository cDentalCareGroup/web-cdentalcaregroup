import { Button, Divider, Form, InputNumber } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import Input from "antd/es/input/Input";
import { useEffect, useRef, useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GetAppointmentAvailabilityRequest, RegisterAppointmentRequest } from "../../data/appointment/appointment.request";
import { AvailableTime } from "../../data/appointment/available.time";
import { availableTimesToTimes } from "../../data/appointment/available.times.extensions";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem } from "../../data/select/select.item.option.extensions";
import { useGetAppointmentAvailabilityMutation, useRegisterAppointmentMutation } from "../../services/appointmentService";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { dayName } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import Calendar from "../components/Calendar";
import SelectSearch from "../components/SelectSearch";
import TopBarHeader from "../components/TopBarHeader";
import LayoutCard from "../layouts/LayoutCard";
import ScheduleAppointmentInfoCard from "./components/ScheduleAppointmentInfoCard";
import crypto from 'crypto';
const ScheduleAppointment = () => {

    const [getBranchOffices] = useGetBranchOfficesMutation();
    const [getAppointmentAvailability, { isLoading }] = useGetAppointmentAvailabilityMutation();
    const [registerAppointment] = useRegisterAppointmentMutation();
    const [branchOffices, setBranchOffices] = useState<SelectItemOption[]>([]);
    const [times, setTimes] = useState<string[]>([]);
    const [date, setDate] = useState(new Date());
    const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
    const [time, setTime] = useState<string>();
    const [branchOffice, setBranchOffice] = useState<SelectItemOption | null>(null);
    const [form] = Form.useForm();
    const nameValue = Form.useWatch('name', form);
    const phoneValue = Form.useWatch('phone', form);
    const emailValue = Form.useWatch('email', form);
    const agreementValue = Form.useWatch('agreement', form);
    const scrollRef = useRef<any>(null)
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const navigate = useNavigate();
    const { referal } = useParams();


    console.log(referal);
    useEffect(() => {
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
                new GetAppointmentAvailabilityRequest(branchOffice.split('-')[0], dayName(date), date, true)).unwrap();
            setTimes(availableTimesToTimes(response));
            setDate(date);
            setAvailableTimes(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleRegisterAppointment = async () => {
        try {
            setIsLoadingAction(true);
            const dateTime = availableTimes.find((value, _) => value.time == time);
            const response = await registerAppointment(
                new RegisterAppointmentRequest(nameValue, phoneValue, date, dateTime, emailValue, branchOffice?.label.split("-")[0], referal)
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER_APPOINTMENT);
            setIsLoadingAction(false);
            navigate(`/appointment/detail/${response}`, {
                replace: true
            });
        } catch (error) {
            setIsLoadingAction(false);
            handleErrorNotification(error);
        }
    }

    const validateFields = () => {
        return nameValue != '' && phoneValue != '' &&
            nameValue != null && phoneValue != null && time != null
    }

    return (
        <LayoutCard isLoading={false} content={
            <div className="flex flex-col w-full h-full">
                <TopBarHeader title={Strings.scheduleAppointment} />
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

                        {branchOffice && <Calendar validateTime={true} availableHours={times} handleOnSelectDate={handleOnDate} isLoading={isLoading} handleOnSelectTime={(value) => {
                            setTime(value);
                            window.scrollTo({ behavior: 'smooth', top: scrollRef.current.offsetTop })
                        }} />}

                        {(branchOffice && time) && <div className="flex lg:w-1/3 w-full px-6 mb-12 flex-wrap mt-12">
                            <Form
                                layout="vertical"
                                form={form}
                                className="flex w-full flex-col flex-wrap"
                                onFinish={() => handleRegisterAppointment()}>
                                <Form.Item
                                    name="name"
                                    label={Strings.patientName}
                                    rules={[{ required: true, message: Strings.requiredName }]}>
                                    <Input
                                        type="string"
                                        size="large"
                                        prefix={<RiUser3Line />}
                                        placeholder={Strings.patientName} />
                                </Form.Item>
                                <br />
                                <Form.Item
                                    name="phone"
                                    label={Strings.phoneNumber}
                                    rules={[
                                        { required: true, message: Strings.requiredPhoneNumber },
                                        { min: 10, message: Strings.invalidPhoneNumber }
                                    ]}>
                                    <Input
                                        type="number"
                                        size="large"
                                        prefix={<RiPhoneLine />}
                                        placeholder={Strings.phoneNumber}
                                    />
                                </Form.Item>
                                <br />

                                <Form.Item
                                    name="email"
                                    label={Strings.email}
                                    rules={[{
                                        type: 'email',
                                        message: Strings.invalidEmail,
                                    }
                                    ]}>
                                    <Input
                                        size="large"
                                        prefix={<RiMailLine />}
                                        placeholder={Strings.email}
                                    />
                                </Form.Item>

                                {validateFields() && <div className="mt-6 mb-6">
                                    <ScheduleAppointmentInfoCard
                                        name={nameValue ?? ''}
                                        primaryContact={phoneValue ?? ''}
                                        email={emailValue ?? ''}
                                        date={date}
                                        time={time}
                                        branchOfficeName={branchOffice?.label.split('-')[0] ?? ''} />
                                </div>}
                                <div ref={scrollRef}></div>
                                {validateFields() && <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value ? Promise.resolve() : Promise.reject(new Error(Strings.requiredTermsConditions)),
                                        },
                                    ]}

                                >
                                    <Checkbox>
                                        Acepto los términos y condiciones, la <Link to={'/'} target='_blank'>politica de privacidad </Link>
                                        y el tratamiento de mis datos.
                                    </Checkbox>
                                </Form.Item>}

                                <Form.Item>
                                    <Button disabled={!agreementValue} type="primary" loading={isLoadingAction} htmlType="submit" >
                                        {Strings.scheduleAppointment}
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>}
                    </div>
                </div>
            </div>
        } />
    );
}

export default ScheduleAppointment;
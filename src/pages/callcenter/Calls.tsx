import { Button, Calendar, Card, Divider, Popover, Row, Tag } from "antd";
import { differenceInDays, format, startOfToday } from "date-fns";
import { useEffect, useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line, } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import { Call } from "../../data/call/call";
import { GetCalls } from "../../data/call/call.response";
import { buildPatientEmail, buildPatientName, buildPatientPhone } from "../../data/patient/patient.extensions";
import { useGetCallsMutation, useRegisterCallLogMutation } from "../../services/callService";
import Constants from "../../utils/Constants";
import { capitalizeAllCharacters, dayName, monthName } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import FormAppointment from "../appointments/FormAppointment";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormCall from "./FormCall";
import { UserRoles } from "../../utils/Extensions";
import Search from "antd/es/input/Search";
import { Patient } from "../../data/patient/patient";
import { Dayjs } from "dayjs";

const Calls = () => {
    const [getCalls, { isLoading }] = useGetCallsMutation();
    const [registerCallLog] = useRegisterCallLogMutation();
    const [data, setData] = useState<any[]>([]);
    const [calls, setCalls] = useState<any[]>([]);
    const navigate = useNavigate();
    const today = startOfToday();
    const [todayDate, setTodayDate] = useState<string>(format(today, "yyyy-MM-dd"));
    const [filterDate, setFilterDate] = useState<string>(format(today, "yyyy-MM-dd"));
    const [call, setCall] = useSessionStorage(
        Constants.CALL,
        null
    );
    const [openCalendar, setOpenCalendar] = useState(false)

    useEffect(() => {
        handleGetCalls(todayDate);
    }, []);


    const handleGetCalls = async (date: string) => {
        try {
            const response = await getCalls({ 'date': date }).unwrap();
            const res = groupBy(response, 'call')
            setData(res);
            setCalls(res);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    var groupBy = function (xs: any, key: any) {
        let array: any[] = []
        const objectDates = xs.reduce(function (rv: any, x: any) {
            (rv[x[key].dueDate] = rv[x[key].dueDate] || []).push(x);
            return rv;
        }, {});
        for (const [key, value] of Object.entries(objectDates)) {
            array.push(new SectionDateCalls(key, value as GetCalls[]))
        }
        return array;
    };

    class SectionDateCalls {
        date: string;
        calls: GetCalls[];

        constructor(date: string,
            calls: GetCalls[]) {
            this.date = date;
            this.calls = calls;
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

    const formatAppointmentDate = (date: string, appointments: number) => {
        const previusDate = new Date(date);
        previusDate.setDate(previusDate.getDate() + 1);
        return `${dayName(previusDate)} ${previusDate.getDate()} de ${monthName(previusDate)}, Llamadas: ${appointments}`;
    }


    const handleOnSearch = (query: string, shoudlSearch: Boolean) => {
        if (query == '' || query == null) {
            setData(calls);
        } else if (shoudlSearch) {
            setData([]);
            const newData: any[] = [];
            for (const value of calls) {
                for (const call of value.calls) {
                    if (call.patient != null) {
                        if (buildPatientName(call.patient as Patient).toLowerCase()
                            .replace(/\s+/g, ' ')
                            .includes(query.toLowerCase())) {
                            newData.push(value);
                        }
                    } else if (call.prospect != null) {
                        if (call.prospect.name.toLowerCase()
                            .replace(/\s+/g, ' ')
                            .includes(query.toLowerCase())) {
                            newData.push(value);
                        }
                    }
                }
            }
            setTimeout(() => {
                setData(newData);
            }, 200)
        }
    }

    const onDateChange = (value: Dayjs) => {
        setFilterDate(value.format('YYYY-MM-DD'));
    };

    const onApplyFilter = (clear: boolean) => {
        setOpenCalendar(false);
        if (clear) {
            handleGetCalls(todayDate)
        } else {
            handleGetCalls(filterDate)
        }
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            title={Strings.callsDay}
            content={
                <div className="flex flex-col">
                    <Search onChange={(event) => handleOnSearch(event.target.value, false)} size="large" placeholder={Strings.searchAppointmentsByPatientName} onSearch={(event) => handleOnSearch(event, true)} enterButton />
                    <div className="flex flex-row gap-2 mt-4">
                        <div className="flex flex-1">
                            <Popover
                                className="cursor-pointer"
                                content={
                                    <div className="flex w-80 flex-col gap-4">
                                        <Calendar fullscreen={false} onChange={(date) => onDateChange(date)} />
                                        <Button onClick={() => onApplyFilter(false)} size="small" type="primary">Aplicar</Button>
                                        <Button onClick={() => onApplyFilter(true)} size="small" type="link">Hoy</Button>
                                    </div>
                                }
                                title="Calendario"
                                trigger="click"
                                open={openCalendar}
                                placement="right"
                                onOpenChange={(_) => setOpenCalendar(!openCalendar)}
                            >
                                <Button size="small">{Strings.calendar}</Button>
                            </Popover>
                        </div>
                        <div className="flex flex-1">
                            <FormAppointment rol={UserRoles.CALL_CENTER} />
                        </div>
                        <div className="flex">
                            <FormCall showPatients={true} onFinish={() => handleGetCalls(todayDate)} />
                        </div>
                    </div>


                    {data.map((item, index) =>
                        <div className="flex flex-col w-full" key={index}>
                            <Divider orientation="left">
                                <span className="text-red-800">{formatAppointmentDate(item.date, item.calls.length)}</span>
                            </Divider>
                            <Row>
                                {item.calls?.map((value: GetCalls, index: number) =>
                                    <Card className="m-2" key={index} title={capitalizeAllCharacters(value.catalog.name)}
                                        actions={[<span onClick={() => {
                                            handleRegisterCallLog(value.call.id);
                                            setCall(value);
                                            window.open(`${location.origin}/callcenter/call`, '_blank')
                                        }}>{Strings.attend}</span>]}
                                    >
                                        {buildInfo(value)}
                                        {buildPriority(value.call)}
                                    </Card>

                                )}
                            </Row>
                        </div>
                    )}

                    <div className="flex flex-row flex-wrap">
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
import { Divider, Row } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { DEFAULT_APPOINTMENTS_FILTERS } from "../../data/filter/filters";
import SelectItemOption from "../../data/select/select.item.option";
import { useGetAppointmentsByBranchOfficeMutation } from "../../services/appointmentService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import SingleFilters from '../components/SingleFilters';
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import { getPatientName } from "../../data/patient/patient.extensions";
import AppointmentCard from "./components/AppointmentCard";
import Constants from "../../utils/Constants";
import useSessionStorage from "../../core/sessionStorage";
import Strings from "../../utils/Strings";
import BackArrow from "../components/BackArrow";
import NoData from "../components/NoData";
import { formatAppointmentDate, UserRoles } from "../../utils/Extensions";
import DataLoading from "../components/DataLoading";
import { sortAppointments } from "../../data/appointment/appointment.extensions";
import FormAppointment from "./FormAppointment";
import { RiContactsBookLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

interface AppointmentsProps {
    rol: UserRoles
}

const Appointments = (props: AppointmentsProps) => {
    const [getAppointmentsByBranchOffice] = useGetAppointmentsByBranchOfficeMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [defaultFilter, setDefaultFilter] = useState(DEFAULT_APPOINTMENTS_FILTERS[0]);
    const [appointments, setAppointments] = useState<SectionDateAppointment[] | undefined>([]);
    const [data, setData] = useState<AppointmentDetail[] | undefined>([]);
    const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);

    //const [sortedData, setSortedData] = useState<SectionDateAppointment[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const location = useLocation();

    useEffect(() => {
        handleGetAppointmentsByBranchOffice(Constants.STATUS_ACTIVE);
    }, []);


    const handleGetAppointmentsByBranchOffice = async (status: string) => {
        try {
            console.log(`BranchID`, branchId);
            setIsLoading(true);
            const response = await getAppointmentsByBranchOffice({ id: Number(branchId), status: status }).unwrap();
            //setSortedData(groupBy(response, 'appointment'));
            setData(response);
            setAppointments(groupBy(sortAppointments(response, status), 'appointment'));
            setIsLoading(false);
            setIsFiltering(false);
        } catch (error) {
            console.log(error);
            handleErrorNotification(error);
        }
    }

    var groupBy = function (xs: any, key: any) {
        let array: any[] = []
        const objectDates = xs.reduce(function (rv: any, x: any) {
            (rv[x[key].appointment] = rv[x[key].appointment] || []).push(x);
            return rv;
        }, {});
        for (const [key, value] of Object.entries(objectDates)) {
            array.push(new SectionDateAppointment(key, value as AppointmentDetail[]))
        }
        return array;
    };

    class SectionDateAppointment {
        date: string;
        appointments: AppointmentDetail[];

        constructor(date: string,
            appointments: AppointmentDetail[]) {
            this.date = date;
            this.appointments = appointments;
        }
    }

    const handleOnSearch = (query: string, shoudlSearch: Boolean) => {
        if (query == '' || query == null) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_ACTIVE);
        } else if (shoudlSearch) {
            setAppointments([]);
            setIsFiltering(true);
            const result = data?.filter((value) =>
                getPatientName(value)
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .includes(query.toLowerCase())
            )
            setAppointments(groupBy(result, 'appointment'));
            setTimeout(() => {
                setIsFiltering(false);
            }, 200)
        }
    }
    const handleOnFilterChange = async (value: SelectItemOption) => {
        setDefaultFilter(value);
        setData([]);
        setAppointments([]);
        if (value.id == 1) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_ACTIVE);
        }
        if (value.id == 2) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_PROCESS);
        }
        if (value.id == 3) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_FINISHED);
        }
        if (value.id == 4) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_FINISHED_APPOINTMENT_OR_CALL);
        }
        if (value.id == 5) {
            handleGetAppointmentsByBranchOffice(Constants.STATUS_NOT_ATTENDED);
        }
    }
    const onStatusChange = (value?: string) => {
        setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[0]);
        handleGetAppointmentsByBranchOffice(Constants.STATUS_ACTIVE);
    }


    const buildCardTitle = (): string => {
        if (props.rol == UserRoles.RECEPTIONIST) {
            return Strings.appointments;
        } else {
            return `${Strings.appointments} - ${location.state?.branchName ?? ''}`
        }
    }
    return (
        <LayoutCard title={buildCardTitle()} isLoading={isLoading} content={

            <div className="flex flex-col">
                {(props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) && <BackArrow />}
                <Search onChange={(event) => handleOnSearch(event.target.value, false)} size="large" placeholder={Strings.searchAppointmentsByPatientName} onSearch={(event) => handleOnSearch(event, true)} enterButton />
                <SingleFilters data={DEFAULT_APPOINTMENTS_FILTERS} onFilterChange={handleOnFilterChange} defaultOption={defaultFilter} />
                {props.rol != UserRoles.CALL_CENTER && <FormAppointment rol={props.rol} onFinish={() => onStatusChange()} />}

                {!isFiltering && <div className="flex flex-col">
                    {appointments?.map((item, index) =>
                        <div className="flex flex-col" key={index}>
                            <Divider orientation="left">
                                <span className="text-red-800">{formatAppointmentDate(item.date, item.appointments.length)}</span>
                            </Divider>
                            <Row>
                                {item.appointments?.map((value, index) => <AppointmentCard rol={props.rol} onlyRead={props.rol == UserRoles.CALL_CENTER} hideContent={false} appointment={value} key={index} onStatusChange={onStatusChange} />)}
                            </Row>
                        </div>
                    )}
                </div>}
                {isFiltering && <DataLoading />}
                {!isLoading && appointments?.length == 0 && <NoData />}
            </div>
        } />);
}

export default Appointments;
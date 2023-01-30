import { Row } from "antd";
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
import { UserRoles } from "../../utils/Extensions";
import DataLoading from "../components/DataLoading";
import { sortAppointments } from "../../data/appointment/appointment.extensions";

interface AppointmentsProps {
    rol: UserRoles
}

const Appointments = (props: AppointmentsProps) => {
    const [getAppointmentsByBranchOffice] = useGetAppointmentsByBranchOfficeMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [defaultFilter, setDefaultFilter] = useState(DEFAULT_APPOINTMENTS_FILTERS[0]);
    const [appointments, setAppointments] = useState<AppointmentDetail[] | undefined>([]);
    const [data, setData] = useState<AppointmentDetail[] | undefined>([]);
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        handleGetAppointmentsByBranchOffice('activa');
    }, []);

    const handleGetAppointmentsByBranchOffice = async (status: string) => {
        try {
            setIsLoading(true);
            const response = await getAppointmentsByBranchOffice({ id: Number(branchId), status: status }).unwrap();
            setData(response);
            setAppointments(sortAppointments(response, status));
            setIsLoading(false);
            setIsFiltering(false);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnSearch = (query: string, shoudlSearch: Boolean) => {
        if (query == '' || query == null) {
            handleGetAppointmentsByBranchOffice('activa');
        } else if (shoudlSearch) {
            setAppointments([]);
            setIsFiltering(true);
            const result = data?.filter((value) =>
                getPatientName(value)
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .includes(query.toLowerCase())
            )
            setAppointments(result);
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
            handleGetAppointmentsByBranchOffice('activa');
        }
        if (value.id == 2) {
            handleGetAppointmentsByBranchOffice('proceso');
        }
        if (value.id == 3) {
            handleGetAppointmentsByBranchOffice('finalizada');
        }
        if (value.id == 4) {
            handleGetAppointmentsByBranchOffice('finalizada-cita');
        }
        if (value.id == 5) {
            handleGetAppointmentsByBranchOffice('no-atendida');
        }
    }
    const onStatusChange = (value: string) => {
        if (value == 'proceso') {
            setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[1]);
        } else if (value == 'finalizada-cita') {
            setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[3]);
        } else if (value == 'activa'){
            setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[0]);
        }else {
            setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[2]);
        }
        handleGetAppointmentsByBranchOffice(value);
    }

    return (
        <LayoutCard title={Strings.appointments} isLoading={isLoading} content={

            <div className="flex flex-col">
                {props.rol == UserRoles.ADMIN && <BackArrow />}
                <Search onChange={(event) => handleOnSearch(event.target.value, false)} size="large" placeholder={Strings.searchAppointmentsByPatientName} onSearch={(event) => handleOnSearch(event, true)} enterButton />
                <SingleFilters data={DEFAULT_APPOINTMENTS_FILTERS} onFilterChange={handleOnFilterChange} defaultOption={defaultFilter} />

                {!isFiltering && <Row>
                    {appointments?.map((value, index) => <AppointmentCard hideContent={false} appointment={value} key={index} onStatusChange={onStatusChange} />
                    )}
                </Row>}
                {isFiltering && <DataLoading />}
                {!isLoading && appointments?.length == 0 && <NoData />}
            </div>
        } />);
}

export default Appointments;
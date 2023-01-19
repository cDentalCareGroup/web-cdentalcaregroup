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
import {  getPatientName } from "../../data/patient/patient.extensions";
import AppointmentCard from "./components/AppointmentCard";
import Constants from "../../utils/Constants";
import useSessionStorage from "../../core/sessionStorage";
import { useNavigate } from "react-router-dom";
import Strings from "../../utils/Strings";
import BackArrow from "../components/BackArrow";
import NoData from "../components/NoData";
import { UserRoles } from "../../utils/Extensions";
import Spinner from "../components/Spinner";
import DataLoading from "../components/DataLoading";

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
    const navigate = useNavigate();
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        handleGetAppointmentsByBranchOffice('activa');
    }, []);

    const handleGetAppointmentsByBranchOffice = async (status: string) => {
        try {
            setIsLoading(true);
            const response = await getAppointmentsByBranchOffice({ id: Number(branchId) }).unwrap();
            setData(response);
            handleFilterAppointments(response, status);
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    const handleFilterAppointments = (response: AppointmentDetail[], query: string) => {
        setAppointments(response?.filter((value, _) => value.appointment.status == query));
        setIsLoading(false);
    }

    const handleOnSearch = (query: string, shoudlSearch: Boolean) => {
        if (query == '' || query == null) {
            handleFilterAppointments(data!,'activa');
        } else if(shoudlSearch) {
            setIsFiltering(true);
            setAppointments([]);
            const result = data?.filter((value) =>
                getPatientName(value)
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .includes(query.toLowerCase())
            )
            setAppointments(result);
            setTimeout(() => {
                setIsFiltering(false);
            },200)
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
            handleGetAppointmentsByBranchOffice('no-atendida');
        }
    }
    const onStatusChange = (value: string) => {
        if (value == 'proceso') {
            setDefaultFilter(DEFAULT_APPOINTMENTS_FILTERS[1]);
        } else {
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
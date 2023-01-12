import { Button, Layout, Row, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { DEFAULT_APPOINTMENTS_FILTERS } from "../../data/filter/filters";
import SelectItemOption from "../../data/select/select.item.option";
import { useGetAppointmentsByBranchOfficeMutation } from "../../services/appointmentService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import SingleFilters from '../components/SingleFilters';
import { AppointmentDetail } from "../../data/appointment/appointment.detail";
import Card from "antd/es/card/Card";
import { getDentist, getPatientEmail, getPatientName, getPatientPrimaryContact } from "../../data/patient/patient.extensions";
import SectionElement from "../components/SectionElement";
import AppointmentCard from "./components/AppointmentCard";
import Constants from "../../utils/Constants";
import useSessionStorage from "../../core/sessionStorage";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Strings from "../../utils/Strings";
import BackArrow from "../components/BackArrow";

const Appointments = () => {
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

    const handleOnSearch = (query: string) => {
        if (query == '' || query == null) {
            handleOnFilterChange(defaultFilter);
        } else {
            const result = data?.filter((value) =>
                getPatientName(value)
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )
            setAppointments(result);
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
            handleGetAppointmentsByBranchOffice('noatendida');
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
        <LayoutCard isLoading={isLoading} content={

            <div className="flex flex-col">
                <BackArrow />
                <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchAppointmentsByPatientName} onSearch={handleOnSearch} enterButton />
                <SingleFilters data={DEFAULT_APPOINTMENTS_FILTERS} onFilterChange={handleOnFilterChange} defaultOption={defaultFilter} />

                <Row>
                    {appointments?.map((value, index) => <AppointmentCard appointment={value} key={index} onStatusChange={onStatusChange} />
                    )}
                </Row>
            </div>
        } />);
}

export default Appointments;
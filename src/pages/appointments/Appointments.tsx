import { Layout } from "antd";
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
import AppointmentCard from "./AppointmentCard";

const Appointments = () => {
    const [getAppointmentsByBranchOffice,{isLoading}] = useGetAppointmentsByBranchOfficeMutation();
    const [defaultFilter, setDefaultFilter] = useState(DEFAULT_APPOINTMENTS_FILTERS[0]);
    const [appointments, setAppointments] = useState<AppointmentDetail[] | undefined>([]);
    const [data, setData] = useState<AppointmentDetail[] | undefined>([]);

    useEffect(() => {
        handleGetAppointmentsByBranchOffice();
    }, []);

    const handleGetAppointmentsByBranchOffice = async () => {
        try {
            const response = await getAppointmentsByBranchOffice({ id: 10 }).unwrap();
            setData(response);
            setAppointments(response);
            //handleFilterAppointments('activa');
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    const handleFilterAppointments = (query: string) => {
        setAppointments(data?.filter((value,_) => value.appointment.status == query));
    }

    const handleOnSearch = (query: string) => {
        // setIsFiltering(true);
        // if (query == '' || query == null) {
        //     handleOnFilterChange(defaultFilter);
        // } else {
        //     const result = allAppointments?.filter((value) =>
        //         buildPatientName(value)
        //             .toLowerCase()
        //             .replace(/\s+/g, '')
        //             .includes(query.toLowerCase().replace(/\s+/g, ''))
        //     )
        //     setAppointments(result);
        //     setIsFiltering(false);
        // }
    }
    const handleOnFilterChange = async (value: SelectItemOption) => {
        // setIsFiltering(true);
        // setAppointments([]);
        // await refetch();
        // if (value.id == 1) {
        //     setAppointments(allAppointments?.filter((value, _) => value.appointment.status == 'activa'));
        // }
        // if (value.id == 2) {
        //     setAppointments(allAppointments?.filter((value, _) => value.appointment.status == 'proceso'));
        // }
        // if (value.id == 3) {
        //     setAppointments(allAppointments?.filter((value, _) => value.appointment.status == 'finalizada'));
        // }
        // if (value.id == 4) {
        //     setAppointments(allAppointments?.filter((value, _) => value.appointment.status == 'noatendida'));
        // }
        // setIsFiltering(false);

        // setDefaultFilter(value);
    }
    return (
        <LayoutCard isLoading={isLoading} content={
            <div className="flex flex-col">
                <Search size="large" placeholder="Buscar citas por nombre de paciente" onSearch={handleOnSearch} enterButton />
                <SingleFilters data={DEFAULT_APPOINTMENTS_FILTERS} onFilterChange={handleOnFilterChange} defaultOption={defaultFilter} />

                {appointments?.map((value,index) => <AppointmentCard appointment={value} key={index} />
                )}
            </div>
        } />);
}

export default Appointments;
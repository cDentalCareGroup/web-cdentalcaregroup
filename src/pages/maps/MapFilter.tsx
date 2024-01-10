import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { BranchOffice } from "../../data/branchoffice/branchoffice";
import { DEFAULT_FILTERS } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import CustomMarker from "../../data/maps/custom.marker";
import { branchOfficesToCustomMarkers, branchOfficeToCustomMarker, patientListToCustomMarkerList } from "../../data/maps/custom.marker.extensions";
import { Patient } from "../../data/patient/patient";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItemEmptyDescription } from "../../data/select/select.item.option.extensions";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetPatientsByBranchOfficeMutation, useGetPatientsMutation, useUpdatePatientLatLngMutation } from "../../services/patientService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Filters from "../components/Filters";
import Map from "../components/Map";
import {
    RiGiftLine,
    RiMailLine,
    RiPhoneLine,
    RiUserLine,
    RiUserLocationLine,
    RiVipDiamondLine,
} from "react-icons/ri";
import SectionElement from "../components/SectionElement";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientName, buildPatientPad, buildPatientPhone } from "../../data/patient/patient.extensions";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";
import { Link } from "react-router-dom";
import { UpdateLatLngRequest } from "../../data/maps/latitude.request";


const MapFilter = () => {
    const [getPatientsByBranchOffice] = useGetPatientsByBranchOfficeMutation();
    const [getPatientsMutation] = useGetPatientsMutation();
    const [getBranchOffices, { isLoading }] = useGetBranchOfficesMutation();
    const [updatePatientLatLng] = useUpdatePatientLatLngMutation();

    const [data, setData] = useState<BranchOffice[]>([]);
    const [filters, setFilters] = useState<SelectItemOption[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [markers, setMarkers] = useState<CustomMarker[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient>();
    const [isOpen, setIsOpen] = useState(false);
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [isActionLoading, setIsActionLoading] = useState(false);


    useEffect(() => {
        handleGetBranchOffices();
    }, []);


    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setMarkers(branchOfficesToCustomMarkers(response));
            setData(response);
            const options = branchOfficesToSelectOptionItemEmptyDescription(response);
            const filters = options.concat(DEFAULT_FILTERS);
            setFilters(filters);
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    const handleOnMarkerClick = (event: CustomMarker) => {
        if (event.type == "patient") {
            setSelectedPatient(
                patients.find((value, _) => value.id === Number(event.title))
            );
            setIsOpen(!isOpen);
        } else {
            alert(`Sucursal ${event.title}`)
        }
    };


    const handleOnFilterChange = async (events: SelectItemOption[]) => {
        setMarkers([]);
        setPatients([]);
        if (events.length == 0) {
            handleGetBranchOffices();
            return;
        }
        if (events.find((value, _) => value.id == 800) != null) {
            setMarkers(branchOfficesToCustomMarkers(data ?? []))
            return;
        }
        let markers: CustomMarker[] = [];
        let allPatients: Patient[] = [];
        const branchOffices = events.filter((value, _) => value.id < 100);
        for await (const filter of branchOffices) {
            const res = await handleGetPatientsByBranchOffice(filter);
            allPatients = allPatients.concat(res);

            const office = data?.find((value, _) => value.id == filter.id);
            if (office != null) {
                markers.push(branchOfficeToCustomMarker(office));
            }

            markers = markers.concat(patientListToCustomMarkerList(res));
        }

        const otherFilters = events.filter((value, _) => value.id >= 100);
        if (otherFilters.length > 0) {
            const response = await getPatientsMutation(new FilterEmployeesRequest(otherFilters)).unwrap();
            allPatients = allPatients.concat(response);
            markers = markers.concat(patientListToCustomMarkerList(response));
        }
        setPatients(allPatients);
        setMarkers(markers);
    }

    const handleGetPatientsByBranchOffice = async ({
        label,
    }: SelectItemOption): Promise<Patient[]> => {
        try {
            const response = await getPatientsByBranchOffice(label).unwrap();
            return response
        } catch (error) {
            console.log(error);
            return [];
        }
    };


    const handleUpdateLatLng = async () => {
        try {
            await updatePatientLatLng(new UpdateLatLngRequest(latitude, longitude, selectedPatient?.id ?? 0)).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsOpen(false);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard isLoading={isLoading}
            content={
                <>
                    {filters.length != 0 && <Filters data={filters} onFilterChange={handleOnFilterChange} />}
                    <Map
                        initCoord={{ lat: 18.9224389, lng: -99.2231394 }}
                        markers={markers}
                        onClick={handleOnMarkerClick}
                    />
                    <Modal title={Strings.patientInformation} okText={Strings.accept} open={isOpen} onOk={() => setIsOpen(false)} onCancel={() => setIsOpen(false)}>
                        <div className="flex flex-col flex-wrap">
                            <SectionElement label={Strings.patientName} value={buildPatientName(selectedPatient)} icon={<RiUserLine className="text-gray-500" />} />
                            <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(selectedPatient)} icon={<RiPhoneLine className="text-gray-500" />} />
                            <SectionElement label={Strings.email} value={buildPatientEmail(selectedPatient)} icon={<RiMailLine className="text-gray-500" />} />
                            <SectionElement label={Strings.birthday} value={buildPatientBirthday(selectedPatient)} icon={<RiGiftLine className="text-gray-500" />} />
                            <SectionElement label={Strings.pad} value={buildPatientPad(selectedPatient)} icon={<RiVipDiamondLine className="text-gray-500" />} />
                            <SectionElement label={Strings.address} value={buildPatientAddress(selectedPatient)} icon={<RiUserLocationLine className="text-gray-500" />} />

                            <div className="flex w-full items-end justify-end">
                                <Link
                                    to='#'
                                    onClick={(e) => {
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${selectedPatient?.lat},${selectedPatient?.lng}`,
                                            '_blank', 'noopener,noreferrer');
                                        e.preventDefault();
                                    }}>
                                    <Button type="link" size="small">{Strings.seePatientAddress}</Button>
                                </Link>
                            </div>
                            <br />
                            <span className="text text-base font-bold text-gray-500">{Strings.updateLatLng}</span>
                            <br />
                            <span className="text text-base text-gray-500">{Strings.latitude}</span>
                            <Input onChange={(event) => setLatitude(Number(event.target.value))} size="large" />
                            <br />
                            <span className="text text-base text-gray-500">{Strings.longitude}</span>
                            <Input onChange={(event) => setLongitude(Number(event.target.value))} size="large" />
                            <br />
                            <div className="flex">
                                <Button onClick={() => handleUpdateLatLng()} loading={isActionLoading} type="primary">{Strings.update} </Button>
                            </div>
                        </div>
                    </Modal>
                </>
            }
        />
    );
}

export default MapFilter;
import { Layout, Modal, QRCode } from "antd";
import { useEffect, useState } from "react";
import { BranchOffice } from "../../data/branchoffice/branchoffice";
import { DEFAULT_FILTERS } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import CustomMarker from "../../data/maps/custom.marker";
import { branchOfficesToCustomMarkers, branchOfficeToCustomMarker, patientListToCustomMarkerList } from "../../data/maps/custom.marker.extensions";
import { Patient } from "../../data/patient/patient";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem } from "../../data/select/select.item.option.extensions";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetPatientsByBranchOfficeMutation, useGetPatientsMutation } from "../../services/patientService";
import { handleErrorNotification } from "../../utils/Notifications";
import Filters from "../components/Filters";
import Map from "../components/Map";
import {
    RiCalendarCheckFill,
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


const MapFilter = () => {
    const [getPatientsByBranchOffice] = useGetPatientsByBranchOfficeMutation();
    const [getPatientsMutation] = useGetPatientsMutation();
    const [getBranchOffices, { isLoading }] = useGetBranchOfficesMutation();
    const [data, setData] = useState<BranchOffice[]>([]);
    const [filters, setFilters] = useState<SelectItemOption[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [markers, setMarkers] = useState<CustomMarker[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        handleGetBranchOffices();
    }, []);


    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setMarkers(branchOfficesToCustomMarkers(response));
            setData(response);
            const options = branchOfficesToSelectOptionItem(response);
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
                            <SectionElement label={Strings.nextAppointment} value={buildPatientName(selectedPatient)} icon={<RiCalendarCheckFill className="text-gray-500" />} />
                            <SectionElement label={Strings.address} value={buildPatientAddress(selectedPatient)} icon={<RiUserLocationLine className="text-gray-500" />} />
                            <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(selectedPatient)} icon={<RiPhoneLine className="text-gray-500" />} />
                            <SectionElement label={Strings.email} value={buildPatientEmail(selectedPatient)} icon={<RiMailLine className="text-gray-500" />} />
                            <SectionElement label={Strings.birthday} value={buildPatientBirthday(selectedPatient)} icon={<RiGiftLine className="text-gray-500" />} />
                            <SectionElement label={Strings.pad} value={buildPatientPad(selectedPatient)} icon={<RiVipDiamondLine className="text-gray-500" />} />
                            <div className="flex w-full items-center justify-center flex-col flex-wrap">
                                <QRCode value={`${selectedPatient?.folio}`} />
                            </div>
                        </div>
                    </Modal>
                </>
            }
        />
    );
}

export default MapFilter;
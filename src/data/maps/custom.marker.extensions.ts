import { BranchOffice } from "../branchoffice/branchoffice";
import { Patient } from "../patient/patient";
import CustomMarker from "./custom.marker";


const branchOfficesToCustomMarkers = (list: BranchOffice[]): CustomMarker[] => {
    return list.filter((value, _) => value.lat != null && value.lng != null).map((value, _) =>
        new CustomMarker(value.name, Number(value.lat), Number(value.lng), "office")
    );
}

const branchOfficeToCustomMarker = (value: BranchOffice): CustomMarker => {
    return new CustomMarker(value.name, Number(value.lat), Number(value.lng), "office");
}

const patientListToCustomMarkerList = (list: Patient[]): CustomMarker[] => {
    return list.filter((value, _) => value.lat != null && value.lng != null).map((value, _) => patientToCustomMarker(value));
}
const patientToCustomMarker = (patient: Patient): CustomMarker => {
    return new CustomMarker(patient.id.toString(), Number(patient.lat), Number(patient.lng), "patient");
}

export {
    branchOfficesToCustomMarkers,
    branchOfficeToCustomMarker,
    patientListToCustomMarkerList
};
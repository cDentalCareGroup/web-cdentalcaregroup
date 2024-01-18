import { capitalizeAllCharacters } from "../../utils/Extensions";
import { Latitudes } from "../maps/latitudes";



export class RegisterPatientRequest {
    name: string;
    lastname: string;
    secondLastname: string;
    birthDate: string;
    gender: string;
    phone: string;
    secondPhone: string;
    email: string;
    street: string;
    streetNumber: string;
    colony: string;
    zipCode: string;
    city: string;
    state: string;
    civilStatus: string;
    occupation: string;
    lat: number;
    lon: number;
    branchOfficeId: number;
    originId: number;
    organization: number;
    folio: string;

    constructor(values: any, latitudes: Latitudes, branchId: any, city: string, colony: string, state: string) {
        this.name = values.name;
        this.lastname = values.lastname;
        this.secondLastname = values.secondLastname;
        this.birthDate = values.birthday;
        this.gender = values.gender;
        this.phone = values.phone;
        this.secondPhone = values.secondPhone;
        this.email = values.email ?? "";
        this.street = values.street;
        this.colony = capitalizeAllCharacters(colony);
        this.zipCode = values.zipCode;
        this.city = capitalizeAllCharacters(city);
        this.state = capitalizeAllCharacters(state);
        this.streetNumber = values.streetNumber ?? "";
        this.civilStatus = values.civilState ?? "other";
        this.occupation = values.occupation ?? "";
        this.lat = latitudes?.lat ?? 0;
        this.lon = latitudes?.lng ?? 0;
        this.branchOfficeId = Number(branchId);
        this.originId = Number(values.origin);
        this.organization = values.organization;
        this.folio = values.folio;
    }
}


export class UpdatePatientStatusRequest {
    patientId: number;
    status: string;
    constructor(patientId: number, status: string) {
        this.patientId = patientId;
        this.status = status;
    }
}


export class UpdatePatientRequest {
    name: string;
    lastname: string;
    secondLastname: string;
    birthDate: string;
    gender: string;
    phone: string;
    secondPhone: string;
    email: string;
    street: string;
    streetNumber: string;
    colony: string;
    zipCode: string;
    city: string;
    state: string;
    civilStatus: string;
    occupation: string;
    lat: number;
    lon: number;
    branchOfficeId: number;
    originId: number;
    patientId: number;
    organization: number;
    startDate: string;
    folio: string;

    constructor(values: any, branchId: any, colony: string, city: string, state: string, latitudes: Latitudes, patientId: number, birthday: string) {
        this.name = values.name;
        this.lastname = values.lastname;
        this.secondLastname = values.secondLastname;
        this.birthDate = birthday;
        this.gender = values.gender;
        this.phone = values.phone;
        this.secondPhone = values.secondPhone;
        this.email = values.email ?? "";
        this.street = values.street;
        this.colony = colony;
        this.zipCode = values.zipCode;
        this.city = city;
        this.state = state;
        this.streetNumber = values.streetNumber ?? "";
        this.civilStatus = values.civilState ?? "other";
        this.occupation = values.occupation ?? "";
        this.lat = latitudes?.lat ?? 0;
        this.lon = latitudes?.lng ?? 0;
        this.branchOfficeId = Number(branchId);
        this.originId = Number(values.origin);
        this.patientId = Number(patientId);
        this.organization = values.organization;
        this.startDate = values.startDate;
        this.folio = values.folio;
    }
}
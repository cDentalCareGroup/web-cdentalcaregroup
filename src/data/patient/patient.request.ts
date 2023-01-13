import { capitalizeFirstLetter } from "../../utils/Extensions";
import { Colony } from "../address/colonies";
import { Latitudes } from "../maps/latitudes";



export class RegisterPatientRequest {
    name: string;
    lastname: string;
    secondLastname: string;
    birthDate: string;
    gender: string;
    phone: string;
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

    constructor(values: any, colony: Colony, latitudes: Latitudes, branchId: any) {
        this.name = values.name;
        this.lastname = values.lastname;
        this.secondLastname = values.secondLastname;
        this.birthDate = values.birthday;
        this.gender = values.gender;
        this.phone = values.phone;
        this.email = values.email ?? "";
        this.street = values.street;
        this.colony = capitalizeFirstLetter(colony.colony);
        this.zipCode = values.zipCode;
        this.city = capitalizeFirstLetter(colony.county?.toLowerCase());
        if (colony.stateCities != null) {
            this.state = capitalizeFirstLetter(colony.stateCities[0].state?.toLocaleLowerCase());
        } else {
            this.state = 'Morelos';
        }
        this.streetNumber = values.streetNumber ?? "";
        this.civilStatus = values.civilState ?? "other";
        this.occupation = values.occupation ?? "";
        this.lat = latitudes?.lat ?? 0;
        this.lon = latitudes?.lng ?? 0;
        this.branchOfficeId = Number(branchId);
        this.originId = Number(values.origin);
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
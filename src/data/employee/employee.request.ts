import { capitalizeFirstLetter } from "../../utils/Extensions";
import { Colony } from "../address/colonies";
import { Latitudes } from "../maps/latitudes";

export class GetEmployeeByTypeRequest {
    type: string;
    constructor(type: string) {
        this.type = type;
    }
}

export class GetEmployeeByBranchOfficeRequest {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}


export class RegisterEmployeeRequest {
    user: string;
    password: string;
    name: string;
    lastname: string;
    secondLastname: string;
    street: string;
    streetNumber: string;
    colony: string;
    cp: string;
    state: string;
    phone: string;
    brithday: string;
    rfc: string;
    nss: string;
    branchOfficeId: number;
    email: string;
    gender: string;
    city: string;
    lat: number;
    lon: number;
    contractType: number;
    employeeType: number;
    role: number;

    constructor(values: any, latitudes: Latitudes, branchId: any, city: string, colony: string, state: string) {
        this.name = values.name;
        this.lastname = values.lastname;
        this.secondLastname = values.secondLastname;
        this.brithday = values.birthday;
        this.gender = values.gender;
        this.phone = values.phone;
        this.email = values.email ?? "";
        this.street = values.street;
        this.colony = capitalizeFirstLetter(colony);
        this.cp = values.zipCode;
        this.city = capitalizeFirstLetter(city);
        this.state = capitalizeFirstLetter(state);
        this.streetNumber = values.streetNumber ?? "";
        this.lat = latitudes?.lat ?? 0;
        this.lon = latitudes?.lng ?? 0;
        this.branchOfficeId = Number(branchId);
        this.nss = values.nss;
        this.rfc = values.rfc;
        this.user = values.username;
        this.password = values.password;
        this.contractType = values.contractType;
        this.employeeType = values.employeeType;
        this.role = values.role;
    }
}


export class UpdateEmployeeRequest {
    id: number;
    user: string;
    password: string;
    name: string;
    lastname: string;
    secondLastname: string;
    street: string;
    streetNumber: string;
    colony: string;
    cp: string;
    state: string;
    phone: string;
    brithday: string;
    rfc: string;
    nss: string;
    branchOfficeId: number;
    email: string;
    gender: string;
    city: string;
    contractType: number;
    employeeType: number;

    constructor(values: any,branchId: any, city: string, colony: string, state: string, id: number) {
        this.name = values.name;
        this.lastname = values.lastname;
        this.secondLastname = values.secondLastname;
        this.brithday = values.birthday;
        this.gender = values.gender;
        this.phone = values.phone;
        this.email = values.email ?? "";
        this.street = values.street;
        this.colony = capitalizeFirstLetter(colony);
        this.cp = values.zipCode;
        this.city = capitalizeFirstLetter(city);
        this.state = capitalizeFirstLetter(state);
        this.streetNumber = values.streetNumber ?? "";
        this.branchOfficeId = Number(branchId);
        this.nss = values.nss;
        this.rfc = values.rfc;
        this.user = values.username;
        this.password = values.password;
        this.contractType = values.contractType;
        this.employeeType = values.employeeType;
        this.id = id;
    }
}
export interface BranchOffice {
    id: number;
    name: string;
    street: string;
    number: string;
    colony: string;
    cp: string;
    primaryContact: string;
    primaryBranchOfficeContact: string;
    email: string;
    status: number;
    lat: number;
    lng: number;
    appointment?: AppointmentStatus;
}

export interface AppointmentStatus {
    active: number;
    proccess: number;
    finshed: number;
    noAttended: number;
}
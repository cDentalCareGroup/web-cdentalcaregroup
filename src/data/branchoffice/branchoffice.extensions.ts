import { AppointmentDetail } from "../appointment/appointment.detail"



const getBranchOfficeName = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.name ?? ''}`;
}

const getBranchOfficePhone = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.primaryContact ?? ''}`;
}

const getBranchOfficeEmail = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.email ?? ''}`;
}

const getBranchOfficeAddress = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.street ??''} ${appointment?.branchOffice.number ??''} ${appointment?.branchOffice.colony ?? ''}, CP.${appointment?.branchOffice.cp ?? ''}`;
}

export {
    getBranchOfficeName,
    getBranchOfficePhone,
    getBranchOfficeEmail,
    getBranchOfficeAddress
}
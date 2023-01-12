import { AppointmentDetail } from "./appointment.detail";

const getAppointmentDate = (appointment: AppointmentDetail | undefined) => {
    return `${appointment?.appointment.appointment ?? ''} ${appointment?.appointment.time ?? ''}`;
}


const getAppointmentFolio = (appointment: AppointmentDetail | undefined) => {
    return `${appointment?.appointment.folio ?? ''}`;
}


const getAppointmentDentist = (appointment: AppointmentDetail | undefined) => {
    const name = appointment?.dentist?.name ?
        `${appointment.dentist?.name} ${appointment.dentist?.lastname} ${appointment.dentist?.secondLastname}` : 'No asignado'
    return name;
}


const getAppointmentStatus = (appointment: AppointmentDetail | undefined) => {
    return `${appointment?.appointment.status.toUpperCase() ?? ''}`;
}

export {
    getAppointmentDate,
    getAppointmentDentist,
    getAppointmentFolio,
    getAppointmentStatus
}
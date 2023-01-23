import { addDays, format } from "date-fns";
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



const formatAppointmentDate = (appointment: AppointmentDetail | undefined): Date => {

    if (appointment?.appointment != null) {
        let date = new Date(appointment?.appointment.appointment);
        date = addDays(date, 1);
        const timeArray = appointment.appointment.time.split(":");
        date.setHours(Number(timeArray[0]), Number(timeArray[1]), Number(timeArray[2]));
        return date;
    }
    return new Date();
}

const sortAppointments = (response: AppointmentDetail[], status: string): AppointmentDetail[] => {

    if (status.includes('finalizada-cita')) {
        const appointments = response.filter((value, _) => value.appointment.status == 'finalizada' && (value.patient?.nextDateAppointment != null && value.patient?.nextDateAppointment != undefined))
        .map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
        const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
            return a.date.valueOf() - b.date.valueOf();
        });
        return dataSorted.map((value, _) => value.appointment);
    } else if(status.includes('finalizada')){
        const appointments = response.filter((value, _) => value.appointment.status == status &&  (value.patient?.nextDateAppointment == null || value.patient?.nextDateAppointment == undefined))
        .map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
        const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
            return a.date.valueOf() - b.date.valueOf();
        });
        return dataSorted.map((value, _) => value.appointment);
    }else {
        const appointments = response.filter((value, _) => value.appointment.status == status).map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
        const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
            return a.date.valueOf() - b.date.valueOf();
        });
        return dataSorted.map((value, _) => value.appointment);
    }
    return [];
}

export class AppointmentDate {
    appointment: AppointmentDetail;
    date: Date;
    constructor(appointment: AppointmentDetail,
        date: Date
    ) {
        this.appointment = appointment;
        this.date = date;
    }
}

export {
    getAppointmentDate,
    getAppointmentDentist,
    getAppointmentFolio,
    getAppointmentStatus,
    sortAppointments
}
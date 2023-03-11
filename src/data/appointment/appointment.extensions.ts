import { addDays, addMinutes, format } from "date-fns";
import Constants from "../../utils/Constants";
import Strings from "../../utils/Strings";
import { AppointmentDetail } from "./appointment.detail";
import { AvailableTime } from "./available.time";

const getAppointmentDate = (appointment: AppointmentDetail | undefined) => {
    return `${appointment?.appointment.appointment ?? ''} ${appointment?.appointment.time ?? ''}`;
}


const getAppointmentFolio = (appointment: AppointmentDetail | undefined) => {
    return `${appointment?.appointment.folio ?? ''}`;
}


const getAppointmentDentist = (appointment: AppointmentDetail | undefined) => {
    const name = appointment?.dentist?.name ?
        `${appointment.dentist?.name} ${appointment.dentist?.lastname} ${appointment.dentist?.secondLastname ?? ''}` : 'No asignado'
    return name;
}


const getAppointmentStatus = (appointment: AppointmentDetail | undefined) => {
    let status = ''

    if (appointment?.appointment.status == Constants.STATUS_ACTIVE) {
        status = 'Activa'
    } else if (appointment?.appointment.status == Constants.STATUS_PROCESS) {
        status = 'Proceso'
    } else if (appointment?.appointment.status == Constants.STATUS_FINISHED) {
        status = 'Finalizada'
    } else if (appointment?.appointment.status == Constants.STATUS_CANCELLED) {
        status = 'Cancelada'
    }
    return status.toUpperCase();
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

    // if (status.includes('finalizada-cita')) {
    //     const appointments = response.filter((value, _) => value.patient?.nextDateAppointment != null && value.patient?.nextDateAppointment != undefined)
    //         .map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
    //     const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
    //         return a.date.valueOf() - b.date.valueOf();
    //     });
    //     return dataSorted.map((value, _) => value.appointment);
    // } else if (status.includes('finalizada')) {
    //     const appointments = response.filter((value, _) => value.patient?.nextDateAppointment == null || value.patient?.nextDateAppointment == undefined)
    //         .map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
    //     const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
    //         return a.date.valueOf() - b.date.valueOf();
    //     });
    //     return dataSorted.map((value, _) => value.appointment);
    // } else {
    const appointments = response.map((value, _) => new AppointmentDate(value, formatAppointmentDate(value)));
    const dataSorted = appointments.sort((a: AppointmentDate, b: AppointmentDate) => {
        return a.date.valueOf() - b.date.valueOf();
    });
    return dataSorted.map((value, _) => value.appointment);
    //}
    // return [];
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


const extendedTimesToShow = (appointment: AppointmentDetail) => {
    if (appointment.extendedTimes != null && appointment.extendedTimes.length > 0) {
        const size = appointment.extendedTimes?.length ?? 0;
        const lastElement = appointment.extendedTimes[size - 1];
        const lastElementArray = lastElement.time.split(":")
        const date = new Date();
        date.setHours(Number(lastElementArray[0]));
        date.setMinutes(Number(lastElementArray[1]));
        const lastDate = addMinutes(date, 30);
        return `De ${formatTime(appointment.appointment.time)} hasta las ${formatTime(format(lastDate, 'HH:mm:ss'))}`
    }
    return ``;
}

const formatTime = (time: string): string => {
    let arrayTime = time.split(":");
    return `${arrayTime[0]}:${arrayTime[1]}`;
}


const filterExtendedAvailableTimes = (appointment: AppointmentDetail, response: AvailableTime[]): AvailableTime[] => {
    let availableTimes: AvailableTime[] = [];
    let appointmentTimeArray = appointment.appointment.time.split(":");
    for (const item of response) {
        const itemTimeArray = item.simpleTime.split(":");
        if (Number(itemTimeArray[0]) >= Number(appointmentTimeArray[0]) &&
            appointment.appointment.time != item.simpleTime) {
            if (!(Number(appointmentTimeArray[1]) == 30 && Number(itemTimeArray[0]) == Number(appointmentTimeArray[0]))) {
                availableTimes.push(item);
            }
        }
    }
    return availableTimes;
}

export {
    getAppointmentDate,
    getAppointmentDentist,
    getAppointmentFolio,
    getAppointmentStatus,
    sortAppointments,
    extendedTimesToShow,
    filterExtendedAvailableTimes
}
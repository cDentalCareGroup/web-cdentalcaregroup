import { AppointmentDetail } from "../appointment/appointment.detail"
import { Patient } from "./patient"
import { formatISO } from "date-fns";



const buildPatientName = (patient: Patient | undefined): string => {
    return `${patient?.name} ${patient?.lastname} ${patient?.secondLastname}`
}
const buildPatientNextAppointment = (patient: Patient | undefined): string => {
    return `${patient?.nextDateAppointment?.toString() ?? 'Sin visita'}`
}
const buildPatientAddress = (patient: Patient | undefined): string => {
    return `${patient?.street} ${patient?.number} ${patient?.colony} ${patient?.cp}`
}
const buildPatientPhone = (patient: Patient | undefined): string => {
    return `${patient?.primaryContact ?? ''}  ${patient?.secondaryContact ?? ''}`
}
const buildPatientEmail = (patient: Patient | undefined): string => {
    return `${patient?.email ?? ''}`
}
const buildPatientBirthday = (patient: Patient | undefined): string => {
    return `${patient?.birthDay?.toString()}`
}
const buildPatientPad= (patient: Patient | undefined): string => {
    return `${patient?.padAcquisitionBranch ?? ''}  ${patient?.padType ?? ''}  ${patient?.padAcquisitionDate?.toString() ?? 'Sin pad'}`
}


const getPatientName = (appointment: AppointmentDetail | undefined) => {
    const name = appointment?.prospect?.name ??
      `${appointment?.patient?.name} ${appointment?.patient?.lastname} ${appointment?.patient?.secondLastname}`;
    return name;
  }
  const getPatientEmail = (appointment: AppointmentDetail | undefined) => {
    const email = appointment?.prospect?.email ?? appointment?.patient?.email ?? '-';
    return email;
  }
  
  const getPatientPrimaryContact = (appointment: AppointmentDetail | undefined) => {
    const primaryContact = appointment?.prospect?.primaryContact ?? appointment?.patient?.primaryContact ?? '-';
    return primaryContact;
  }
  
  const getDentist = (appointment: AppointmentDetail | undefined) => {
    const name = appointment?.dentist?.name ?
      `${appointment.dentist?.name} ${appointment.dentist?.lastname} ${appointment.dentist?.secondLastname}` : 'No asignado'
    return name;
  }
  
  const getStartFinishedDate = (appointment: AppointmentDetail) => {
    try {
      const startDate = formatISO(new Date(appointment.appointment.startedAt)).split("T")[1].split("-")[0];
      const endDate = formatISO(new Date(appointment.appointment.finishedAt)).split("T")[1].split("-")[0];
      return `${startDate} - ${endDate}`;
    } catch (error) {
      return ``;
    }
  }
  
  const getHasLabs = (appointment: AppointmentDetail | undefined) => {
    const hasLabs = appointment?.appointment.hasLabs == 1 ? 'Si' : 'No';
    return hasLabs;
  }
  const getPatientPad = (appointment: AppointmentDetail | undefined) => {
    if (appointment?.patient != null) {
      if (appointment.patient.pad) {
        const pad = `${appointment?.patient?.padType} - ${appointment?.patient?.padAcquisitionDate} - ${appointment?.patient?.padExpirationDate}`
        return pad;
      } else {
        return `Sin pad`;
      }
    } else {
      return `Sin pad`;
    }
  }
  
  
  const getIsPatient = (appointment: AppointmentDetail | undefined) => {
    const isPatient = appointment?.patient != null ? 'Si' : 'Falta registro';
    return isPatient;
  }
  
  
  
  const getPatientAddress = (appointment: AppointmentDetail | undefined) => {
    if (appointment?.patient != null) {
      const address = `${appointment?.patient?.street} ${appointment?.patient?.colony}, ${appointment?.patient?.state ?? ''} CP.${appointment?.patient?.cp}`
      return address;
    }
  }
  
  const getPatientBirthDay = (appointment: AppointmentDetail | undefined) => {
    if (appointment?.patient != null) {
      const birthDay = `${appointment.patient.birthDay}`;
      return birthDay;
    }
  }
  
  const getPatientGender = (appointment: AppointmentDetail | undefined) => {
    if (appointment?.patient != null) {
      const gender = `${appointment.patient.gender}`;
      return gender;
    }
  }

  



export {
    buildPatientName,
    buildPatientNextAppointment,
    buildPatientAddress,
    buildPatientPhone,
    buildPatientEmail,
    buildPatientPad,
    buildPatientBirthday,
    getDentist,
    getHasLabs,
    getIsPatient,
    getPatientAddress,
    getPatientBirthDay,
    getPatientEmail,
    getPatientGender,
    getPatientName,
    getPatientPad,
    getPatientPrimaryContact,
    getStartFinishedDate,
}
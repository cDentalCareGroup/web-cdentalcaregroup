import { AppointmentDetail } from "../appointment/appointment.detail"
import { PadComponentService, Patient } from "./patient"
import { formatISO } from "date-fns";
import { capitalizeFirstLetter } from "../../utils/Extensions";

const DEFAULT_FIELD_VALUE = "-"

const buildPatientName = (patient: Patient | undefined): string => {
  return `${patient?.name} ${patient?.lastname} ${patient?.secondLastname}`
}

const buildPatientAddress = (patient: Patient | undefined): string => {
  return `${patient?.street} ${patient?.number} ${patient?.colony} ${patient?.cp}`
}
const buildPatientPhone = (patient: Patient | undefined): string => {
  return `${patient?.primaryContact ?? DEFAULT_FIELD_VALUE}`
}
const buildPatientEmail = (patient: Patient | undefined): string => {
  if (patient?.email != null && patient.email != "") {
    return patient.email;
  } else {
    return DEFAULT_FIELD_VALUE;
  }
}
const buildPatientBirthday = (patient: Patient | undefined): string => {
  return `${patient?.birthDay?.toString()}`
}
const buildPatientPad = (patient: Patient | undefined): string => {
  if (patient?.pad != null && patient.pad != undefined && patient.pad > 0) {
    return `PAD ${patient?.padType ?? ''}  ${patient?.padAcquisitionDate?.toString()}`
  } else {
    return 'Sin PAD'
  }
}

const buildPatientStartedAt = (patient: Patient | undefined): string => {
  return `${patient?.startDate ?? DEFAULT_FIELD_VALUE}`;
}

const buildPatientGender = (patient: Patient | undefined): string => {
  if (patient != null) {
    if (patient.gender == 'male') {
      return 'Masculino';
    }
    if (patient.gender == 'male') {
      return 'Femenino';
    }
    if (patient.gender == 'other') {
      return 'Otro';
    }
  }
  return DEFAULT_FIELD_VALUE;
}

const getPatientName = (appointment: AppointmentDetail | undefined) => {
  const name = appointment?.prospect?.name ??
    `${capitalizeFirstLetter(appointment?.patient?.name)} ${capitalizeFirstLetter(appointment?.patient?.lastname)} ${capitalizeFirstLetter(appointment?.patient?.secondLastname ?? '')}`;
  return name;
}
const getPatientEmail = (appointment: AppointmentDetail | undefined): string => {
  if (appointment?.prospect != null && appointment.prospect.email != "") {
    return appointment.prospect.email;
  }
  if (appointment?.patient != null && appointment.patient.email != "") {
    return appointment.patient.email;
  }
  return DEFAULT_FIELD_VALUE;
}

const getPatientPrimaryContact = (appointment: AppointmentDetail | undefined): string => {
  if (appointment?.prospect != null && appointment.prospect.primaryContact != "") {
    return appointment.prospect.primaryContact;
  }
  if (appointment?.patient != null) {
    if (appointment.patient.primaryContact != "") {
      return appointment.patient.primaryContact;
    } else {
      return DEFAULT_FIELD_VALUE;
    }
  }
  return DEFAULT_FIELD_VALUE;
}

const getDentist = (appointment: AppointmentDetail | undefined) => {
  const name = appointment?.dentist?.name ?
    `${appointment.dentist?.name} ${appointment.dentist?.lastname ?? ''} ${appointment.dentist?.secondLastname ?? ''}` : 'No asignado'
  return name;
}

const getStartFinishedDate = (appointment: AppointmentDetail) => {
  try {
    const startDate = formatISO(new Date(appointment.appointment.startedAt)).split("T")[1].split("-")[0];
    const endDate = formatISO(new Date(appointment.appointment.finishedAt)).split("T")[1].split("-")[0];
    return `${startDate} - ${endDate}`;
  } catch (error) {
    return DEFAULT_FIELD_VALUE;
  }
}

const getHasLabs = (appointment: AppointmentDetail | undefined) => {
  const hasLabs = appointment?.appointment.hasLabs == 1 ? 'Si' : 'No';
  return hasLabs;
}
const getHasCabinet = (appointment: AppointmentDetail | undefined) => {
  const hasCabinet = appointment?.appointment.hasCabinet == 1 ? 'Si' : 'No';
  return hasCabinet;
}
const getPatientPad = (appointment: AppointmentDetail | undefined) => {
  if (appointment?.patient != null) {
    if (appointment.patient.pad) {
      const pad = `${capitalizeFirstLetter(appointment?.patient?.padType)} - ${appointment?.patient?.padAcquisitionDate} - ${appointment?.patient?.padExpirationDate}`
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
  return DEFAULT_FIELD_VALUE;
}

const getPatientBirthDay = (appointment: AppointmentDetail | undefined) => {
  if (appointment?.patient != null) {
    const birthDay = `${appointment.patient.birthDay}`;
    return birthDay;
  }
  return DEFAULT_FIELD_VALUE;
}

const getPatientGender = (appointment: AppointmentDetail | undefined) => {
  if (appointment?.patient != null) {
    const gender = `${appointment.patient.gender}`;
    return gender.toLowerCase() == 'male' ? 'Masculino' : 'Femenino';
  }
  return DEFAULT_FIELD_VALUE;
}


const padComponentsToDataTable = (components: PadComponentService[]): any[] => {
  let data: any[] = [];
  let index = 0;
  for (const item of components) {
    data.push({
      key: index,
      service: item.service.name,
      discount: item.component.discount,
      discountTwo: item.component.discountTwo,
      quantity: item.component.maxPatientQuantity,
      quantityPatient: item.component.maxPatientQuantity
    })
    index++;
  }
  return data;
}




export {
  buildPatientName,
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
  buildPatientGender,
  buildPatientStartedAt,
  getHasCabinet,
  padComponentsToDataTable
}
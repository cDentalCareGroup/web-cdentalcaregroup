import { Payment } from "../payment/payment";
import { Service } from "../service/service";
import { AppointmentDetail } from "./appointment.detail";
import { AppointmentDetailService } from "./appointment.detail.service";
import { AvailableTime } from "./available.time";

export class RegisterAppointmentDentistRequest {
  id: number;
  appointmentId: number;
  username: string;
  patientId: string;

  constructor(id: number,
    appointmentId: number, username: string, patientId: string) {
    this.id = id;
    this.appointmentId = appointmentId;
    this.username = username;
    this.patientId = patientId;
  }
}

export class UpdateAppointmentStatusRequest {
  id: number;
  status: string;
  amount: string;
  paid: string;
  services: any[];
  padId?: number;
  payments: any[];
  shouldAddAmount: boolean;
  deposits?: Payment[];
  debts?: Payment[];

  constructor(id: number, status: string, amount: string, paid: string, services: any[], payments: any[], shouldAddAmount: boolean, padId?: number, deposits?: Payment[], debts?: Payment[]
  ) {
    this.id = id;
    this.status = status;
    this.amount = amount;
    this.paid = paid;
    this.services = services;
    this.padId = padId;
    this.payments = payments;
    this.shouldAddAmount = shouldAddAmount;
    this.deposits = deposits;
    this.debts = debts;
  }
}
export class GetAppointmentAvailabilityRequest {
  branchOfficeName: string;
  dayName: string;
  date: Date;
  filterHours?: boolean;
  constructor(branchOfficeName: string,
    dayName: string, date: Date, filterHours?: boolean) {
    this.branchOfficeName = branchOfficeName;
    this.dayName = dayName;
    this.date = date;
    this.filterHours = filterHours;
  }

}

export class RescheduleAppointmentRequest {
  id: number;
  date?: Date;
  time?: AvailableTime;
  branchName?: string;
  nofity?: boolean;
  comments?: string;
  blockCalendar?: boolean;

  constructor(
    id: number,
    date?: Date,
    time?: AvailableTime,
    branchName?: string,
    nofity?: boolean,
    comments?: string,
    blockCalendar?: boolean
  ) {
    this.time = time;
    this.id = id;
    this.date = date;
    this.branchName = branchName;
    this.nofity = nofity;
    this.comments = comments;
    this.blockCalendar = blockCalendar;
  }
}

export class AppointmentAvailbilityByDentistRequest {
  dentistId: string;
  dayname: string;
  branchOfficeId: string;
  date: string;

  constructor(dentistId: string,
    dayname: string,
    branchOfficeId: string,
    date: string,) {
    this.dentistId = dentistId;
    this.dayname = dayname;
    this.branchOfficeId = branchOfficeId;
    this.date = date;
  }

}

export class GetAppointmentDetail {
  appointment: AppointmentDetail;
  services: AppointmentServiceInfo[];


  constructor(appointment: AppointmentDetail,
    services: AppointmentServiceInfo[]
  ) {
    this.appointment = appointment;
    this.services = services;
  }
}

export class AppointmentServiceInfo {
  service: Service;
  info: AppointmentDetailService;

  constructor(service: Service,
    info: AppointmentDetailService) {
    this.service = service;
    this.info = info;
  }
}


export class RegisterNextAppointmentRequest {
  date?: Date;
  time?: AvailableTime;
  patientId: number;
  branchOfficeId: string;
  dentistId: string;
  hasLabs: number;
  hasCabinet: number;
  services: number[];
  nextAppointmentId: number;
  nofity?: boolean;
  comments?: string;
  blockCalendar?: boolean;

  constructor(
    patientId: number,
    branchOfficeId: string,
    dentistId: string,
    hasLabs: number,
    hasCabinet: number,
    services: number[],
    nextAppointmentId: number,
    date?: Date,
    time?: AvailableTime,
    nofity?: boolean,
    comments?: string,
    blockCalendar?: boolean) {
    this.date = date;
    this.time = time;
    this.patientId = patientId;
    this.branchOfficeId = branchOfficeId;
    this.dentistId = dentistId;
    this.hasLabs = hasLabs;
    this.hasCabinet = hasCabinet;
    this.services = services;
    this.nextAppointmentId = nextAppointmentId;
    this.nofity = nofity;
    this.comments = comments;
    this.blockCalendar = blockCalendar;
  }

}

export class RegisterAppointmentRequest {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableTime;
  email?: string;
  branchName?: string;
  referal?: string;

  constructor(
    name?: string,
    phone?: string,
    date?: Date, time?: AvailableTime, email?: string, branchName?: string, referal?: string) {
    this.time = time;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.email = email;
    this.branchName = branchName;
    this.referal = referal;
  }
}

export class CancelAppointmentRequest {
  folio: string;
  reason: string;

  constructor(folio: string,
    reason: string
  ) {
    this.folio = folio;
    this.reason = reason;
  }

}

export class UpdateHasLabsAppointmentRequest {
  id: number;
  hasLabs: number;
  constructor(id: number, hasLabs: number) {
    this.id = id;
    this.hasLabs = hasLabs;
  }
}

export class UpdateHasCabinetAppointmentRequest {
  id: number;
  hasCabinet: number;
  constructor(id: number, hasCabinet: number) {
    this.id = id;
    this.hasCabinet = hasCabinet;
  }
}

export class ExtendAppointmentRequest {
  id: number;
  times: string[];
  appointment: string;
  constructor(id: number,
    times: string[],
    appointment: string) {
    this.id = id;
    this.times = times;
    this.appointment = appointment;
  }
}



export class RegisterCallCenterAppointmentRequest {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableTime;
  email?: string;
  branchId?: number;
  patientId?: number;
  prospectId?: number;
  callId?: number;
  nofity?: boolean;
  isCallCenter?: boolean;
  comments?: string;
  blockCalendar?: boolean;
  constructor(
    name?: string,
    phone?: string,
    date?: Date, time?: AvailableTime, email?: string, branchId?: number, patientId?: number, prospectId?: number, callId?: number, nofity?: boolean, isCallCenter?: boolean, comments?: string, blockCalendar?: boolean) {
    this.time = time;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.email = email;
    this.branchId = branchId;
    this.patientId = patientId;
    this.prospectId = prospectId;
    this.callId = callId;
    this.nofity = nofity;
    this.isCallCenter = isCallCenter;
    this.comments = comments;
    this.blockCalendar = blockCalendar;
  }
}

export class RegiserAppointmentPatientRequest {
  appointmentId: number;
  patientId: number;
  constructor(appointmentId: number,
    patientId: number) {
    this.appointmentId = appointmentId;
    this.patientId = patientId;
  }
}
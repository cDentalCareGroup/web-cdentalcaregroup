import { AppointmentDetail } from "./appointment.detail";
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
  constructor(id: number, status: string, amount: string) {
    this.id = id;
    this.status = status;
    this.amount = amount;
  }
}
export class GetAppointmentAvailabilityRequest {
  branchOfficeName: string;
  dayName: string;
  date: Date;

  constructor(branchOfficeName: string,
    dayName: string, date: Date) {
    this.branchOfficeName = branchOfficeName;
    this.dayName = dayName;
    this.date = date;
  }

}

export class RescheduleAppointmentRequest {
  id: number;
  date?: Date;
  time?: AvailableTime;
  branchName?: string;

  constructor(
    id: number,
    date?: Date,
    time?: AvailableTime,
    branchName?: string) {
    this.time = time;
    this.id = id;
    this.date = date;
    this.branchName = branchName;
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
  nextAppointments: AppointmentDetail[];


  constructor(appointment: AppointmentDetail,
    nextAppointments: AppointmentDetail[]
  ) {
    this.appointment = appointment;
    this.nextAppointments = nextAppointments;
  }
}


export class RegisterNextAppointmentRequest {
  date?: Date;
  time?: AvailableTime;
  patientId: number;
  branchOfficeId: string;
  dentistId: string;
  hasLabs: boolean;

  constructor(
    patientId: number,
    branchOfficeId: string,
    dentistId: string,
    hasLabs: boolean,
    date?: Date,
    time?: AvailableTime,) {
    this.date = date;
    this.time = time;
    this.patientId = patientId;
    this.branchOfficeId = branchOfficeId;
    this.dentistId = dentistId;
    this.hasLabs = hasLabs;
  }

}

export class RegisterAppointmentRequest {
  name?: string;
  phone?: string;
  date?: Date;
  time?: AvailableTime;
  email?: string;
  branchName?: string;

  constructor(
    name?: string,
    phone?: string,
    date?: Date, time?: AvailableTime, email?: string, branchName?: string) {
    this.time = time;
    this.name = name;
    this.phone = phone;
    this.date = date;
    this.email = email;
    this.branchName = branchName;
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
  hasLabs: boolean;
  constructor(id: number, hasLabs: boolean) {
      this.id = id;
      this.hasLabs = hasLabs;
  }
}
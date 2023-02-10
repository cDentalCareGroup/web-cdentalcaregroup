import { BranchOffice } from "../branchoffice/branchoffice";
import { Employee } from "../employee/employee";
import { Patient } from "../patient/patient";
import { Prospect } from "../prospect/prospect";
import { Service } from "../service/service";
import { Appointment } from "./appointment";
import { AppointmentTimes } from "./appointment.times";

export class AppointmentDetail {
    appointment: Appointment;
    branchOffice: BranchOffice;
    patient?: Patient;
    prospect?: Prospect;
    dentist?: Employee;
    services?: Service[]
    extendedTimes?: AppointmentTimes[];
  
    constructor( appointment: Appointment,
      branchOffice: BranchOffice,
      patient?: Patient,
      prospect?: Prospect, dentist?: Employee, services?: Service[], extendedTimes?: AppointmentTimes[]) {
        this.appointment = appointment;
        this.branchOffice = branchOffice;
        this.patient = patient;
        this.prospect = prospect;
        this.dentist = dentist;
        this.services = services;
        this.extendedTimes = extendedTimes;
    }
  }
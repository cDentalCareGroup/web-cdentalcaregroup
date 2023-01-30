import { BranchOffice } from "../branchoffice/branchoffice";
import { Employee } from "../employee/employee";
import { Patient } from "../patient/patient";
import { Prospect } from "../prospect/prospect";
import { Service } from "../service/service";
import { Appointment } from "./appointment";

export class AppointmentDetail {
    appointment: Appointment;
    branchOffice: BranchOffice;
    patient?: Patient;
    prospect?: Prospect;
    dentist?: Employee;
    service?: Service
  
    constructor( appointment: Appointment,
      branchOffice: BranchOffice,
      patient?: Patient,
      prospect?: Prospect, dentist?: Employee, service?: Service) {
        this.appointment = appointment;
        this.branchOffice = branchOffice;
        this.patient = patient;
        this.prospect = prospect;
        this.dentist = dentist;
        this.service = service;
    }
  }
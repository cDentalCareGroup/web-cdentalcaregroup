import { Employee } from "../employee/employee";
import { Patient } from "../patient/patient";
import { Appointment } from "./appointment";


export class AppointmentDetailCalendar {
    appointment: Appointment;
    patient?: Patient;
    dentist?: Employee;
  
    constructor( appointment: Appointment, patient?: Patient, dentist?: Employee) {
        this.appointment = appointment;
        this.patient = patient;
        this.dentist = dentist;
    }
  }
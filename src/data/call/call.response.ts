import { Appointment } from "../appointment/appointment";
import { Patient } from "../patient/patient";
import { Call } from "./call";
import { CallCatalog } from "./call.catalog";

export class GetCalls {
    call: Call;
    patient: Patient;
    catalog: CallCatalog;
    appointment?: Appointment;
    constructor(call: Call,
        patient: Patient,
        catalog: CallCatalog, appointment?: Appointment) {
        this.call = call;
        this.patient = patient;
        this.appointment = appointment;
        this.catalog = catalog;
    }
}
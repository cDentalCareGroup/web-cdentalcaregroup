import { Appointment } from "../appointment/appointment";
import { AppointmentDetail } from "../appointment/appointment.detail";
import { Patient } from "../patient/patient";
import { Prospect } from "../prospect/prospect";
import { Call } from "./call";
import { CallCatalog } from "./call.catalog";

export interface GetCalls {
    call: Call;
    catalog: CallCatalog;
    patient?: Patient;
    appointment?: Appointment;
    propspect?: Prospect;
}


export interface GetCallDetail {
    calls: CallCatalogDetail[];
    appointments: AppointmentDetail[];
}

export interface CallCatalogDetail {
    catalogName: string;
    catalogId: number;
    callId: number;
    callDueDate: string;
    appointment?: string;
    callStatus: string;
    description: string;
}

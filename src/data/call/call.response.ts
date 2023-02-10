import { Appointment } from "../appointment/appointment";
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
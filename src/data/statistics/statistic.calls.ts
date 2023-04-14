import { Call } from "../call/call";
import { CallCatalog } from "../call/call.catalog";
import { CallLog } from "../call/call.log";
import { Patient } from "../patient/patient";
import { Prospect } from "../prospect/prospect";

export interface GetStatisticsCalls {
    active: Call[];
    solvedCalls: Call[];
    expiredCalls: Call[];
} 


export interface GetCallsReports {
    call: Call;
    catalog: CallCatalog;
    logs: CallLog[];
    patient?: Patient;
    prospect?: Prospect;
}
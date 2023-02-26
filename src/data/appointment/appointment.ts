import { Call } from "../call/call";

export interface Appointment {
    id: number;
    appointment: string;
    branchId: number;
    branchName: string;
    scheduleBranchOfficeId: number;
    time: string;
    dentistId: number;
    receptionistId: number;
    status: string;
    costAmount: number;
    priceAmount: number;
    prospectId: number;
    patientId: number;
    scheduledAt: Date;
    folio: string;
    startedAt: string;
    finishedAt: string;
    comments: string;
    hasLabs?: number;
    hasCabinet?: number;
    nextAppointmentId: number;
    nextAppointmentDate: string;
    call?: Call;
}
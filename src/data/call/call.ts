export interface Call {
    id: number;
    patientId: number;
    appointmentId: number;
    dueDate: Date;
    description: string;
    caltalogId: number;
    status: string;
    effectiveDate: Date;
    comments: string;
    result: string;
    callComments: string;
}

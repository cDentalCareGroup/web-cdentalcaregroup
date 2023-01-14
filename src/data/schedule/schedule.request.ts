export class RegisterScheduleeEmployeeRequest {
    branchId: number;
    employeeId: number;
    scheduleId: number;

    constructor(branchId: number,
        employeeId: number,
        scheduleId: number) {
        this.branchId = branchId;
        this.employeeId = employeeId;
        this.scheduleId = scheduleId;
    }
}

export class DeleteEmpoyeeScheduleRequest {
    scheduleId: number;
    dentistId: number;
    constructor(scheduleId:number, dentistId: number) {
        this.scheduleId = scheduleId;
        this.dentistId=dentistId;
    }
}
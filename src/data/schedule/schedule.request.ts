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

export class UpdateAvailableTimeStatusRequest {
    id: number;
    status: string;
    constructor(id: number, status: string) {
        this.id = id;
        this.status = status;
    }
}
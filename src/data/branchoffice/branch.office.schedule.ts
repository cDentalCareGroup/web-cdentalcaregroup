export class BranchOfficeSchedule {
    id: number;
    branchId: number;
    dayName: string;
    startTime: string;
    endTime: string;
    seat: number;
    status: string;

    constructor(id: number,
        branchId: number,
        dayName: string,
        startTime: string,
        endTime: string,
        seat: number,
        status: string) {
        this.id = id;
        this.branchId = branchId;
        this.dayName = dayName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.seat = seat;
        this.status = status;
    }
}
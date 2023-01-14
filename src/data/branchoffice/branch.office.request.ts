
  export class DeleteScheduleRequest {
    scheduleId: string | number;
    constructor(scheduleId: string | number) {
      this.scheduleId = scheduleId;
    }
  }


export class GetSchedulesByBranchOfficeRequest {
    id: string;
    constructor(id: string) {
        this.id = id;
    }
}


export class RegisterScheduleRequest {
    branchOfficeId: string;
    dayName: string;
    startTime: string;
    endTime: string;
    seat: string;


    constructor(branchOfficeId: string,
        dayName: string,
        startTime: string,
        endTime: string,
        seat: string) {
        this.branchOfficeId = branchOfficeId;
        this.dayName = dayName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.seat = seat;
    }

}
export class AvailableTime {
    id: number;
    time: string;
    simpleTime: string;
    seat: number;
    scheduleBranchOfficeId: number;
    constructor(id: number, time: string, simpleTime: string, seat:number, scheduleBranchOfficeId: number) {
      this.id = id;
      this.time = time;
      this.simpleTime = simpleTime;
      this.seat = seat;
      this.scheduleBranchOfficeId = scheduleBranchOfficeId;
    }
  }
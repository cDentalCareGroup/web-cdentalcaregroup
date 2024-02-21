class CalendarAppointmentEvent {
    title: string;
    start: Date;
    end: Date;
    color: string;
    status: string;
  
    constructor(
      title: string,
      start: Date,
      end: Date,
      color: string,
      status: string
    ) {
      this.title = title;
      this.start = start;
      this.end = end;
      this.color = color;
      this.status = status;
    }
  }
  
  export default CalendarAppointmentEvent;
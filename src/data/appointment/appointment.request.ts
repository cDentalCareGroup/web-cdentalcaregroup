export class RegisterAppointmentDentistRequest {
    id: number;
    appointmentId: number;
    username: string;
    patientId: string;
  
    constructor(id: number,
      appointmentId: number, username: string, patientId: string) {
      this.id = id;
      this.appointmentId = appointmentId;
      this.username = username;
      this.patientId = patientId;
    }
  }
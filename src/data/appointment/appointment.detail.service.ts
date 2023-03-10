export interface AppointmentDetailService {
    id: number;
    appointmentId: number;
    patientId: number;
    dentistId: number;
    serviceId: number;
    quantity: number;
    unitPrice: number;
    discount: number;
    price: number;
    subTotal: number;
    comments: string;
    labCost: number;
}
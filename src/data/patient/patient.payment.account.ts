import { AppointmentDetail } from "../appointment/appointment.detail";
import { Payment } from "../payment/payment";
import { PaymentDetail } from "../payment/payment.detail";
import { Service } from "../service/service";


export interface PatientPaymentAccount {
    appointmentInfo: AppointmentInfo;
    paymentInfo?: PatientPaymentInfo;
}


export interface PatientPaymentInfo {
    payment: Payment;
    details: PaymentDetail[];
}

interface AppointmentInfo {
    appointment: AppointmentDetail;
    services: ServiceDetail[];
}

interface ServiceDetail {
    service: Service;
    detail: AppointmentServiceDetail;
}

interface AppointmentServiceDetail {
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

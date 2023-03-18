
export interface PaymentDetail{
    id: number;
    patientId: number;
    referenceId: number;
    paymentId: number;
    movementTypeApplicationId: number;
    amount: number;
    createdAt: Date;
    movementType: String;
    sign: String;
    order: number;
    paymentMethodId: number;

}
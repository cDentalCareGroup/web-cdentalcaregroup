
export interface Payment {
    id: number;
    patientId: number;
    referenceId: number;
    movementTypeId: number;
    paymentMethodId: number;
    amount: number;
    movementType: String;
    movementSign: String;
    createdAt: Date;
    dueDate: Date;
    status: string;
    isAplicable: boolean;
    aplicableAmount: number;
}
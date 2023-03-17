import { Payment } from "./payment";



export interface PaymentInfo {
    deposits?: Payment[];
    debts?: DebtInfo[];
}

export interface DebtInfo {
    amountDebt: number;
    debt: Payment;
}

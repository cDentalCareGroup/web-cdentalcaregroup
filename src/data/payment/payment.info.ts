import { Payment } from "./payment";



export interface PaymentInfo {
    deposits?: DepositInfo[];
    debts?: DebtInfo[];
}

export interface DebtInfo {
    amountDebt: number;
    debt: Payment;
}

export interface DepositInfo {
    amountDeposit: number;
    deposit: Payment;
}

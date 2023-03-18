import { PaymentInfo } from "./payment.info";


const processPaymentInfo = (data: PaymentInfo): PaymentInfo => {
    let item = data;
    item.deposits = item.deposits?.map((value, _) => {
        let element = value;
        element.deposit.isAplicable = true;
        return element;
    });
    return item;
}

export {
    processPaymentInfo
}
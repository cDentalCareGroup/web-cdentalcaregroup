import { PaymentInfo } from "./payment.info";


const processPaymentInfo = (data: PaymentInfo): PaymentInfo => {
    let item = data;
    item.deposits = item.deposits?.map((value, _) => {
        let element = value;
        element.isAplicable = true;
        return element;
    });
    return item;
}

export {
    processPaymentInfo
}
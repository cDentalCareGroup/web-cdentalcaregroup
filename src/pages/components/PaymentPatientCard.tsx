import { Divider } from "antd";
import { PaymentInfo } from "../../data/payment/payment.info";
import { formatPrice, formatServiceDate } from "../../utils/Extensions";
import Strings from "../../utils/Strings";
import SectionElement from "./SectionElement";

interface PaymentPatientCardProps {
    paymentInfo: PaymentInfo;
}

const PaymentPatientCard = ({ paymentInfo }: PaymentPatientCardProps) => {
    return (
        <div className="flex flex-col">
            {(paymentInfo != undefined && paymentInfo.deposits != null && paymentInfo.deposits.length > 0) && <div className="flex flex-col flex-wrap gap-2">
                <Divider>Abonos a cuenta</Divider>
                {paymentInfo.deposits.map((value, index) => <SectionElement size="sm" key={index} label={Strings.receivedAmount} value={`${formatPrice(value.amountDeposit)}, Fecha ${formatServiceDate(value.deposit.createdAt)}`} icon={<></>} />)}
            </div>}

            {(paymentInfo != undefined && paymentInfo.debts != null && paymentInfo.debts.length > 0) && <div className="flex flex-col flex-wrap gap-2">
                <Divider>Saldo por cobrar</Divider>
                {paymentInfo.debts.map((value, index) => <SectionElement size="sm" key={index} label={'Saldo por cobrar'} value={`${formatPrice(value.amountDebt)}, Fecha ${formatServiceDate(value.debt.createdAt)}`} icon={<></>} />)}
            </div>}
        </div>
    );
}

export default PaymentPatientCard;
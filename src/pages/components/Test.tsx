import LayoutCard from "../layouts/LayoutCard";
import FormPayment, { FormPaymentSource } from "../payments/FormPayment";

const Test = () => {

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <span>testing</span>

                    <FormPayment source={FormPaymentSource.FORM} />
                </div>
            }
        />
    );
}

export default Test;
import LayoutCard from "../layouts/LayoutCard";
import FormPayment from "../payments/FormPayment";

const Test = () => {

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <span>testing</span>

                    <FormPayment />
                </div>
            }
        />
    );
}

export default Test;
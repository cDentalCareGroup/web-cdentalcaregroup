import LayoutCard from "../layouts/LayoutCard";
import FormEmployee from "./FormEmployee";

const Employees = () => {
    return (<LayoutCard
        isLoading={false}
        title='Empleados'
        content={
            <div className="flex flex-col">
                <FormEmployee />
            </div>
        }
    />);
}

export default Employees;
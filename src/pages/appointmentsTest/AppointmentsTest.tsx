import LayoutCard from "../layouts/LayoutCard";
import Strings from "../../utils/Strings";
import { UserRoles } from "../../utils/Extensions";


interface AppointmentsProps {
    rol: UserRoles
}

const AppointmentsTest = (props: AppointmentsProps) => {
   


    return (
        <LayoutCard
		  title={Strings.appointmentsTest}
		  isLoading={false}
		  content={
			<div className="flex flex-col">

            </div>
		  }
		/>
    );
}

export default AppointmentsTest;
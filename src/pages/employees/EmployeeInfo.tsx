import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { RiCalendar2Line, RiFileList3Line, RiFunctionLine, RiHeartPulseLine, RiMailLine, RiPhoneLine, RiUser3Line, RiUserHeartLine, RiVipDiamondLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { EmployeeInfo } from "../../data/employee/employee.info";
import { Patient } from "../../data/patient/patient";
import { buildPatientAddress, buildPatientBirthday, buildPatientEmail, buildPatientGender, buildPatientName, buildPatientPad, buildPatientPhone, buildPatientStartedAt } from "../../data/patient/patient.extensions";
import { useGetEmployeeMutation } from "../../services/employeeService";
import { useGetPatientMutation } from "../../services/patientService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import NoData from "../components/NoData";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormEmployee, { FormEmployeeType } from "./FormEmployee";

const EmployeeInfoCard = () => {

    const { id } = useParams();
    const [getEmployee, {isLoading}] = useGetEmployeeMutation();
    const [data, setData] = useState<EmployeeInfo>();

    useEffect(() => {
        handleGetEmployee();
    }, []);


    const handleGetEmployee = async () => {
        try {
            const response = await getEmployee({id:id}).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const tabs: any[] = [
        {
            label: <div className="flex items-baseline gap-1 justify-center"><RiFileList3Line /><span className="text text-sm">Informacion del empleado</span></div>,
            key: 1,
            children: <FormEmployee type={FormEmployeeType.UPDATE} employee={data?.employee} />,
        },
    ];

    return (
        <LayoutCard showBack={true} isLoading={isLoading} content={
            <div className="flex flex-col">
                {data && <Tabs
                    size="large"
                    type="card"
                    items={tabs}
                />}
            </div>
        } />);
}

export default EmployeeInfoCard;
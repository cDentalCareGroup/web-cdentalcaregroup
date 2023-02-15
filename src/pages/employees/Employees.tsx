import { Button, Card, List, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildEmployeeName } from "../../data/employee/employee.extentions";
import { EmployeeInfo } from "../../data/employee/employee.info";
import { useGetEmployeesMutation } from "../../services/employeeService";
import { RESPONSIVE_LIST } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";
import EmployeeCard from "./components/EmployeeCard";

const Employees = () => {
    const navigate = useNavigate();
    const [getEmployees, { isLoading }] = useGetEmployeesMutation();
    const [employeeList, setEmployeeList] = useState<EmployeeInfo[]>([]);
    const [data, setData] = useState<EmployeeInfo[]>([]);

    useEffect(() => {
        handleGetEmployees();
    }, []);

    const handleGetEmployees = async () => {
        try {
            const response = await getEmployees({}).unwrap();
            setEmployeeList(response);
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setEmployeeList(data);
        }
        const res = data?.filter((value) =>
            buildEmployeeName(value.employee)
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setEmployeeList(res);
    }

    return (<LayoutCard
        isLoading={isLoading}
        title={Strings.employees}
        content={
            <div className="flex flex-col">
                <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchEmployee} onSearch={handleOnSearch} enterButton />
                <div className="flex w-full items-end justify-end mt-4 mb-12">
                    <Button type="primary" onClick={() => navigate('/admin/employees/register')}>{Strings.registerEmployee}</Button>
                </div>
                <List
                    grid={RESPONSIVE_LIST}
                    dataSource={employeeList}
                    renderItem={(item) => (
                        <List.Item>
                           <EmployeeCard  data={item} />
                        </List.Item>
                    )}
                />
            </div>
        }
    />);
}

export default Employees;
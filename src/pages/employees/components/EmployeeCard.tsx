import { Card, Tag } from "antd";
import { RiHospitalLine, RiMailLine, RiPhoneLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { buildEmployeeEmail, buildEmployeeName, buildEmployeeNumber } from "../../../data/employee/employee.extentions";
import { EmployeeInfo } from "../../../data/employee/employee.info";
import Strings from "../../../utils/Strings";
import SectionElement from "../../components/SectionElement";

interface EmployeeCardProps {
    data: EmployeeInfo;
}
const EmployeeCard = ({ data }: EmployeeCardProps) => {

    const navigate = useNavigate();

    const getStauts = (): JSX.Element => {
        if (data.employee.status == 1) {
            return <Tag color="success">{Strings.statusActive}</Tag>
        }
        if (data.employee.status == 2) {
            return <Tag color="blue">{Strings.statusInactive}</Tag>
        }
        if (data.employee.status == 3) {
            return <Tag color="default">{Strings.statusDisabled}</Tag>
        }
        return <></>;
    }

    const buildBranchOfficeName = (): string => {
        return `${data.branchOffice.name}`;
    }
    return (
        <Card actions={[<span onClick={() => navigate(`/admin/employees/detail/${data.employee.id}`)}>{Strings.seeInfo}</span>]} title={buildEmployeeName(data.employee)}>
            <SectionElement icon={<RiHospitalLine />} label={Strings.branchOffice} value={buildBranchOfficeName()} />
            <SectionElement icon={<RiMailLine />} label={Strings.email} value={buildEmployeeEmail(data.employee)} />
            <SectionElement icon={<RiPhoneLine />} label={Strings.phoneNumber} value={buildEmployeeNumber(data.employee)} />
            {getStauts()}
        </Card>
    );
}

export default EmployeeCard;
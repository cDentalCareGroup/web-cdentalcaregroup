import { Card, Row, Tag } from "antd";
import Layout from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { BranchOffice } from "../../data/branchoffice/branchoffice";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { handleErrorNotification } from "../../utils/Notifications";
import SectionElement from "../components/SectionElement";
import { useNavigate, Link } from "react-router-dom";
import LayoutCard from "../layouts/LayoutCard";
import {
    RiPhoneLine,
} from "react-icons/ri";
const BranchOffices = () => {
    const [getBranchOffices, { isLoading }] = useGetBranchOfficesMutation();
    const [data, setData] = useState<BranchOffice[]>([]);
    const navigation = useNavigate();

    useEffect(() => {
        handleGetBranchOffices();
    }, []);


    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            content={
                <div className="flex max-w-full">
                    <Row>
                        {data.map((value, index) =>
                            <Card key={index} title={value.name} className="m-2 cursor-pointer" actions={[
                                <Link to={'/admin/branchoffice/appointment'}>
                                    Ver citas
                                </Link>
                            ]}>
                                <SectionElement label="Numero telefonico" value={value.primaryContact} icon={<RiPhoneLine />} />
                                <div className="flex">
                                    <Tag color="processing">Citas {value.appointmens}</Tag>
                                </div>
                            </Card>
                        )}
                    </Row>
                </div>
            }
        />

    );
}



export default BranchOffices;
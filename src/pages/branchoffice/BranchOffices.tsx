import { Button, Card, Divider, Form, List, Row, Select, Table, Tag, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { BranchOffice } from "../../data/branchoffice/branchoffice";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { handleErrorNotification } from "../../utils/Notifications";
import SectionElement from "../components/SectionElement";
import { Link, useNavigate } from "react-router-dom";
import LayoutCard from "../layouts/LayoutCard";
import {

    RiPhoneLine,
} from "react-icons/ri";
import Constants from "../../utils/Constants";
import useSessionStorage from "../../core/sessionStorage";
import Strings from "../../utils/Strings";
import { RESPONSIVE_LIST, RESPONSIVE_LIST_SMALL } from "../../utils/Extensions";


interface BranchOfficesProps {
    type: BranchOfficeType;
}

export enum BranchOfficeType {
    APPOINTMENTS, SCHEDULES
}

const BranchOffices = (props: BranchOfficesProps) => {
    const [getBranchOffices, { isLoading }] = useGetBranchOfficesMutation();
    const [data, setData] = useState<BranchOffice[]>([]);
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const navigate = useNavigate();
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

    const buildBranchOfficesTitle = () => {
        if (props.type == BranchOfficeType.APPOINTMENTS) {
            return Strings.appointments
        } else {
            return Strings.schedulesBranchOffice
        }
    }


    const buildActions = (value: BranchOffice) => {
        if (props.type == BranchOfficeType.APPOINTMENTS) {
            return [
                <Link onClick={() => {
                    setBranchId(value.id);
                }} to={'/admin/branchoffice/appointments'}>
                    Ver citas
                </Link>
            ]
        } else {
            return [

            ]
        }
    }


    const buildAppointmentStatus = (value: BranchOffice): JSX.Element => {
        return (
            <div className="flex flex-row gap-2 flex-wrap">
                <Tag color="success">{`Citas activas ${value.appointment?.active ?? ''}`}</Tag>
                <Tag color="processing">{`Citas en proceso ${value.appointment?.proccess ?? ''}`}</Tag>
                <Tag color="default">{`Citas finalizadas ${value.appointment?.finshed ?? ''}`}</Tag>
                <Tag color="error">{`Citas no atendidas ${value.appointment?.noAttended ?? ''}`}</Tag>
            </div>
        );
    }

    return (
        <LayoutCard
            title={buildBranchOfficesTitle()}
            isLoading={isLoading}
            content={
                <div className="flex flex-col max-w-full">
                    <List
                        grid={RESPONSIVE_LIST_SMALL}
                        dataSource={data}
                        renderItem={(value, index) => (
                            <List.Item>
                                <Card key={index} title={value.name} className="m-2 cursor-pointer" actions={buildActions(value)}>
                                    <SectionElement label={Strings.phoneNumber} value={value.primaryContact} icon={<RiPhoneLine />} />
                                    {props.type == BranchOfficeType.APPOINTMENTS && buildAppointmentStatus(value)}

                                    {props.type == BranchOfficeType.SCHEDULES && <div className="flex gap-2 mt-4">
                                        <Button onClick={() => {
                                            navigate(`/admin/branchoffices/schedules/detail/${value.id}`)
                                        }}>{Strings.seeSchedules}</Button>
                                    </div>}
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            }
        />

    );
}



export default BranchOffices;
import { useEffect, useState } from "react";
import useSessionStorage from "../../core/sessionStorage";
import { GetSchedulesByBranchOfficeRequest } from "../../data/branchoffice/branch.office.request";
import { BranchOfficeSchedule } from "../../data/branchoffice/branch.office.schedule";
import { useGetAvailableTimesByBranchOfficeMutation } from "../../services/branchOfficeService";
import Constants from "../../utils/Constants";
import { handleErrorNotification,} from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import AvailableTimeCard from "./components/AvailableTimeCard";

const AvailableTimes = () => {
    const [getAvailableTimesByBranchOffice, { isLoading }] = useGetAvailableTimesByBranchOfficeMutation();
    const [branchId, setBranchId] = useSessionStorage(Constants.BRANCH_ID, 0);
    const [availableTimes, setAvailableTimes] = useState<BranchOfficeSchedule[]>([]);

    useEffect(() => {
        handleGetAvailableTimes();
    }, []);

    const handleGetAvailableTimes = async () => {
        try {
            const response = await getAvailableTimesByBranchOffice(
                new GetSchedulesByBranchOfficeRequest(branchId)
            ).unwrap();
            setAvailableTimes(response);
            console.log(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard
            title="Horarios de la clinica"
            isLoading={isLoading}
            content={
                <div className="flex flex-row flex-wrap gap-6">
                    {availableTimes.map((value, index) => <AvailableTimeCard data={value} onStatusChange={() => handleGetAvailableTimes()} />)}
                </div>
            }
        />
    );
}

export default AvailableTimes;
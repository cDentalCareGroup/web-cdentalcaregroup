import { useEffect, useState } from "react";
import { useGetAvailableTimesByBranchOfficeMutation, useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useEffect } from "react";
import useSessionStorage from "../../core/sessionStorage";
import { GetSchedulesByBranchOfficeRequest } from "../../data/branchoffice/branch.office.request";
import { BranchOfficeSchedule } from "../../data/branchoffice/branch.office.schedule";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import Constants from "../../utils/Constants";
import { handleErrorNotification,} from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";


const FormAvailableTimes = () => {
    const [getBranchOffices] = useGetBranchOfficesMutation();
    

    useEffect(() => {
        handleGetBranchOffices();
    }, []);

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            console.log(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard
            title="Horarios"
            isLoading={false}
            content={
                <div>

                </div>
            }
        />
    );
}

export default FormAvailableTimes;
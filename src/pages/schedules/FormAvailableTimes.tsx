import { useEffect, useState } from "react";
import { useGetAvailableTimesByBranchOfficeMutation, useGetBranchOfficesMutation } from "../../services/branchOfficeService";
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
import { useEffect, useState } from "react";
import { callDataToStatisticChar } from "../../data/statistics/statistic.extensions";
import { useGetStatisticsMutation } from "../../services/statisticService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
const Dashboard = () => {

    const [getStatistics] = useGetStatisticsMutation();
    const [callsChar, setCallsChar] = useState<any>();

    useEffect(() => {
        handleGetStatistics();
    }, []);


    const handleGetStatistics = async () => {
        try {
            const response = await getStatistics({}).unwrap();
            console.log(response);
            setCallsChar(callDataToStatisticChar(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <LayoutCard
            isLoading={false}
            title='Estadisticas'
            content={
                <div className="flex flex-col">



                </div>

            }
        />
    );
}

export default Dashboard;
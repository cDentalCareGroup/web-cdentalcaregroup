import { Card } from "antd";
import { useEffect, useState } from "react";
import { RiCloseCircleFill, RiCloseCircleLine } from "react-icons/ri";
import { GetStatisticsCalls } from "../../data/statistics/statistic.calls";
import { callDataToStatisticChar, PieData } from "../../data/statistics/statistic.extensions";
import { useGetCallStatisticsMutation, useGetStatisticsMutation } from "../../services/statisticService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import PieChar from "./components/PieChar";


const Dashboard = () => {

    const [callsData, setCallsData] = useState<GetStatisticsCalls>();
    const [getCallStatistics] = useGetCallStatisticsMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [showCallsChar, setShowCallsChar] = useState(false);
    const [callData, setCallData] = useState<PieData>();

    useEffect(() => {
        handleGetStatistics();
    }, []);


    const handleGetStatistics = async () => {
        try {
            setIsLoading(true);
            const response = await getCallStatistics({}).unwrap();
            setCallsData(response);
            console.log(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }


    return (
        <LayoutCard
            isLoading={isLoading}
            title='Dashboard'
            content={
                <div>
                    <div className="flex flex-row flex-wrap">
                        {callsData != null && callsData != undefined && <PieChar data={callDataToStatisticChar(callsData)} onClick={(value) => {
                            setCallData(value);
                            setShowCallsChar(true);
                        }} />}
                        {showCallsChar &&
                            <Card bordered={false}>
                                <div className="flex flex-col">
                                    <RiCloseCircleLine className="cursor-pointer" onClick={() => setShowCallsChar(false)} size={20} />
                                    content {JSON.stringify(callData)}
                                </div>
                            </Card>
                        }
                    </div>
                </div>

            }
        />
    );
}

export default Dashboard;
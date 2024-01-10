import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { GetCallsReports } from "../../data/statistics/statistic.calls";
import { useGetCallsReportMutation } from "../../services/statisticService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import CallCenterReport from "./components/CallCenterReport";
import { ServicesSalesReport } from "./components/ServicesSalesReport";


const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [getCallsReport] = useGetCallsReportMutation();

    const [callsReport, setCallsReport] = useState<GetCallsReports[]>([]);

    useEffect(() => {
        //  getCallReport();
    }, []);

    const getCallReport = async () => {
        try {
            setIsLoading(true);
            const response = await getCallsReport({}).unwrap();
            setCallsReport(response);
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
                <iframe frameBorder={0} className="flex flex-col w-full h-full" src="https://analytics-cdentalcaregroup.web.app/" />
            }
        />
    );
}

export default Dashboard;
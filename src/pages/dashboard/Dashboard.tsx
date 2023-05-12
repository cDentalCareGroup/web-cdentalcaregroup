import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { GetCallsReports, GetStatisticsCalls } from "../../data/statistics/statistic.calls";
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
        getCallReport();
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
                <div>


                    <Collapse
                        bordered={false}
                        className="flex flex-col w-full"
                        defaultActiveKey={['0']}
                        expandIcon={({ isActive }) => isActive ? <RiArrowDownSLine /> : <RiArrowRightSLine />}>

                        <Collapse.Panel header="Reporte llamadas efectuadas" key="1">
                            <CallCenterReport data={callsReport} />
                        </Collapse.Panel>


                        <Collapse.Panel header="Venta de servicios por categoria" key="12">
                            <ServicesSalesReport />
                        </Collapse.Panel>

                    </Collapse>


                </div>
            }
        />
    );
}

export default Dashboard;
import { Card, Divider, Statistic } from "antd";
import { useEffect, useState } from "react";
import { RiCloseCircleFill, RiCloseCircleLine } from "react-icons/ri";
import { GetStatisticsCalls } from "../../data/statistics/statistic.calls";
import { callDataToStatisticChar, PieData } from "../../data/statistics/statistic.extensions";
import { useGetCallStatisticsMutation, useGetPaymentsStatisticsMutation, useGetStatisticsMutation } from "../../services/statisticService";
import { formatPrice } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";
import PieChar from "./components/PieChar";


const Dashboard = () => {

    const [callsData, setCallsData] = useState<GetStatisticsCalls>();
    const [getCallStatistics] = useGetCallStatisticsMutation();
    const [getPaymentsStatistics] = useGetPaymentsStatisticsMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [showCallsChar, setShowCallsChar] = useState(false);
    const [callData, setCallData] = useState<PieData>();

    const [dataPayment, setDataPayment] = useState<any[]>([]);

    useEffect(() => {
        handleGetStatistics();
        handleGetPaymentStatistics();
    }, []);


    const handleGetStatistics = async () => {
        try {
            setIsLoading(true);
            const response = await getCallStatistics({}).unwrap();
            setCallsData(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }

    const handleGetPaymentStatistics = async () => {
        try {
            setIsLoading(true);
            const response = await getPaymentsStatistics({}).unwrap();
            console.log(response);
            setDataPayment(response);
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


                        <div className="flex flex-row flex-wrap gap-6 mb-4">
                            {dataPayment.map((value, index) => <Card bordered={false} key={index} title={value.branchOffice.name}>
                                <Divider>{`Fecha ${value.date}`} </Divider>
                                <Statistic title="Ingresos totales" value={formatPrice(value.total)} />
                                <Statistic valueStyle={{
                                    color: '#3f8600'
                                }} title="Pagos recibidos" value={formatPrice(value.balance)} />
                                <Statistic valueStyle={{
                                    color: '#cf1322'
                                }} title="Pagos pendientes" value={formatPrice(value.pending)} />
                            </Card>)}
                        </div>
                        <Divider></Divider>


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
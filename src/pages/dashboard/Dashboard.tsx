import { useEffect, useState } from "react";
import { callDataToStatisticChar } from "../../data/statistics/statistic.extensions";
import { useGetStatisticsMutation } from "../../services/statisticService";
import { handleErrorNotification } from "../../utils/Notifications";
import LayoutCard from "../layouts/LayoutCard";


import { Pie } from '@ant-design/plots';
import { Card, Statistic } from "antd";

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

    const config = {
        angleField: 'value',
        colorField: 'type',
        radius: 0.4,
        label: {
            type: 'inner',
            offset: '-30%',

            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };

    return (
        <LayoutCard
            isLoading={false}
            title='Dashboard'
            content={
                <div className="flex flex-row gap-6 flex-wrap">

                    {/* <Card >
                        <Pie style={{width:400}} data={callsChar} {...config} />
                    </Card> */}


                    <Card bordered={true}>
                        <Statistic
                            title="Citas activas"
                            value={6}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>

                    <Card bordered={true}>
                        <Statistic
                            title="Citas en proceso"
                            value={3}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>

                    <Card bordered={true}>
                        <Statistic
                            title="Citas no atendidas"
                            value={0}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>

                    <Card bordered={true}>
                        <Statistic
                            title="Llamadas activas"
                            value={6}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>

                    <Card  bordered={true}>
                        <Statistic
                            title="Llamadas resueltas"
                            value={2}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>

                </div>

            }
        />
    );
}

export default Dashboard;
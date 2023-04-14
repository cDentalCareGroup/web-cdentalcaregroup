import { Pie } from "@ant-design/charts";
import { Card } from "antd";
import { Event } from "@antv/g2";
import { PieData } from "../../../data/statistics/statistic.extensions";



interface PieCharProps {
    data: PieData[]
    onClick: (value: PieData) => void
}

const PieChar = (props: PieCharProps): JSX.Element => {
    const config = {
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
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

    const handleOnEvent = (event: Event) => {
        if (event.type == 'plot:click') {
            if (event.data != null) {
                props.onClick(event.data.data)
            }
        }
    }

    return (
        <div className="flex flex-col w-96">
             <Pie legend={{
                    layout: 'vertical',
                    position: 'right'

                }} autoFit={true} data={props.data} {...config} onEvent={(_, event) => handleOnEvent(event)} />
        </div>
    );
}

export default PieChar;
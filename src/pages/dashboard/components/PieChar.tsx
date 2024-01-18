import { Pie } from "@ant-design/charts";
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

    return (
        <div className="flex flex-col w-96">
             <Pie legend={{
                    layout: 'vertical',
                    position: 'right'

                }} autoFit={true} data={props.data} {...config} />
        </div>
    );
}

export default PieChar;
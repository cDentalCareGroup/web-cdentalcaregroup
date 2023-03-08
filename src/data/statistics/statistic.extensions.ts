import Constants from "../../utils/Constants";
import { GetStatisticsCalls } from "./statistic.calls";


export class PieData {
    type: string;
    value: number;

    constructor(type: string,
        value: number) {
        this.type = type;
        this.value = value;
    }
}


const callDataToStatisticChar = (data: GetStatisticsCalls): PieData[] => {
    return [
        new PieData('Llamadas activas', data.active.length),
        new PieData('Llamadas retrasadas', data.expiredCalls.length),
        new PieData('Llamadas resueltas', data.solvedCalls.length)
    ];
}


export {
    callDataToStatisticChar
}
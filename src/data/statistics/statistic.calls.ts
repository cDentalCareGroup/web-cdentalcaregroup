import { Call } from "../call/call";

export interface GetStatisticsCalls {
    active: Call[];
    solvedCalls: Call[];
    expiredCalls: Call[];
} 
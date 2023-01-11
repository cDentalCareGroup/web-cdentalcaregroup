import { AvailableTime } from "./available.time";

const availableTimesToTimes = (times: AvailableTime[]) => {
    return times.map((value, _) => value.time);
}

export { availableTimesToTimes };
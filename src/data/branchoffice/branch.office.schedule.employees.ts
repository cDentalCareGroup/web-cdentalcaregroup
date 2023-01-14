import { Employee } from "../employee/employee";
import { BranchOfficeSchedule } from "./branch.office.schedule";

export class ScheduleEmployees {
    schedule: BranchOfficeSchedule;
    employees: Employee[];

    constructor(schedule: BranchOfficeSchedule,
        employees: Employee[]) {
        this.schedule = schedule;
        this.employees = employees;
    }
}
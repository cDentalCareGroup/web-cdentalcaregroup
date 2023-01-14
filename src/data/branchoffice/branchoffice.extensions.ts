import { AppointmentDetail } from "../appointment/appointment.detail"
import { BranchOfficeSchedule } from "./branch.office.schedule";

import React from "react";
import { ScheduleEmployees } from "./branch.office.schedule.employees";
import { RegisterScheduleeEmployeeRequest } from "../schedule/schedule.request";

const getBranchOfficeName = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.name ?? ''}`;
}

const getBranchOfficePhone = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.primaryContact ?? ''}`;
}

const getBranchOfficeEmail = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.email ?? ''}`;
}

const getBranchOfficeAddress = (appointment: AppointmentDetail | undefined): string => {
    return `${appointment?.branchOffice.street ?? ''} ${appointment?.branchOffice.number ?? ''} ${appointment?.branchOffice.colony ?? ''}, CP.${appointment?.branchOffice.cp ?? ''}`;
}

const branchOfficeSchedulesToDataTable = (schedules: ScheduleEmployees[]) => {
    let data = [];
    for (const schedule of schedules) {
        data.push({
            key: schedule.schedule.id,
            day: schedule.schedule.dayName,
            startDate: schedule.schedule.startTime,
            endDate: schedule.schedule.endTime,
            employees: schedule.employees
        });
    }
    return data;
}


const scheduleEmployeeOptionToRegisterSchedule = (branchOfficeId: number, employeeId: number, scheduleId: number): RegisterScheduleeEmployeeRequest[] => {
    return [new RegisterScheduleeEmployeeRequest(branchOfficeId, employeeId, scheduleId)]
}

export {
    getBranchOfficeName,
    getBranchOfficePhone,
    getBranchOfficeEmail,
    getBranchOfficeAddress,
    branchOfficeSchedulesToDataTable,
    scheduleEmployeeOptionToRegisterSchedule
}
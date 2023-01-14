import { BranchOfficeSchedule } from "../data/branchoffice/branch.office.schedule";
import { ScheduleEmployees } from "../data/branchoffice/branch.office.schedule.employees";
import { BranchOffice } from "../data/branchoffice/branchoffice";
import { apiSlice } from "./apiSlice";

export const branchOfficeService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBranchOffices: builder.mutation<BranchOffice[], any>({
            query: (_) => ({
                url: '/branchoffice/all',
                method: "GET",
            }),
            transformResponse: (response: { data: BranchOffice[] }, _, __) => response.data,
        }),
        getSchedulesByBranchOffice: builder.mutation<ScheduleEmployees[], any>({
            query: (data) => ({
                url: '/branchoffice/schedules/employees',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: ScheduleEmployees[] }, _, __) => response.data,
        }),
        registerBranchOfficeSchedule: builder.mutation<any, any>({
            query: (data) => ({
                url: '/branchoffice/register/schedule',
                method: "POST",
                body: { ...data },
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
        }),
        deleteBranchOfficeSchedule: builder.mutation<any,any>({
            query: (data) => ({
                url: '/branchoffice/delete/schedule',
                method: "POST",
                body: { ...data },
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
        }),
    }),
});

export const {
    useGetBranchOfficesMutation,
    useGetSchedulesByBranchOfficeMutation,
    useRegisterBranchOfficeScheduleMutation,
    useDeleteBranchOfficeScheduleMutation
} = branchOfficeService;
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
        getAvailableTimesByBranchOffice: builder.mutation<BranchOfficeSchedule[], any>({
            query: (data) => ({
                url: '/branchoffice/schedules/id',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: BranchOfficeSchedule[] }, _, __) => response.data,
        }),
        updateAvailableTimeStatus: builder.mutation<any, any>({
            query: (data) => ({
                url: '/branchoffice/schedule/status',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
    }),
});

export const {
    useGetBranchOfficesMutation,
    useGetSchedulesByBranchOfficeMutation,
    useRegisterBranchOfficeScheduleMutation,
    useDeleteBranchOfficeScheduleMutation,
    useGetAvailableTimesByBranchOfficeMutation,
    useUpdateAvailableTimeStatusMutation
} = branchOfficeService;
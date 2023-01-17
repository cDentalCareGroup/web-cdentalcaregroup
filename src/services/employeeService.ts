import { Employee } from "../data/employee/employee";
import { EmployeeInfo } from "../data/employee/employee.info";
import { EmployeeType } from "../data/employee/employee.types";
import { Role } from "../data/user/role";
import { apiSlice } from "./apiSlice";

export const employeeService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeesByType: builder.mutation<Employee[], any>({
      query: (data) => ({
        url: '/employee/byType',
        method: "POST",
        body: { ...data }
      }),
      transformResponse: (response: { data: Employee[] }, _, __) => response.data,
    }),
    getEmployeesByBranchOffice: builder.mutation<Employee[], any>({
      query: (data) => ({
        url: '/employee/branchoffice',
        method: "POST",
        body: { ...data }
      }),
      transformResponse: (response: { data: Employee[] }, _, __) => response.data,
    }),
    registerEmployeeSchedule: builder.mutation<any, any>({
      query: (data) => ({
        url: '/employee/schedules',
        method: "POST",
        body: {
          "data": data
        }
      }),
      transformResponse: (response: { data: any }, _, __) => response.data,
    }),

    deleteEmployeeSchedule: builder.mutation<any, any>({
      query: (data) => ({
        url: '/employee/delete/schedule',
        method: "POST",
        body: {
          ...data
        }
      }),
      transformResponse: (response: { data: any }, _, __) => response.data,
    }),
    getEmployeeTypes: builder.mutation<EmployeeType[], any>({
      query: (_) => ({
        url: 'employee/getTypes',
        method: "GET",
      }),
      transformResponse: (response: { data: EmployeeType[] }, _, __) => response.data,
    }),
    registerEmployee: builder.mutation<any, any>({
      query: (data) => ({
        url: 'employee/register',
        method: "POST",
        body: { ...data }
      }),
      transformResponse: (response: { data: any }, _, __) => response.data,
    }),
    updateEmployee: builder.mutation<any, any>({
      query: (data) => ({
        url: 'employee/update',
        method: "POST",
        body: { ...data }
      }),
      transformResponse: (response: { data: any }, _, __) => response.data,
    }),
    getEmployeeRoles: builder.mutation<Role[], any>({
      query: (_) => ({
        url: 'employee/roles',
        method: "GET",
      }),
      transformResponse: (response: { data: Role[] }, _, __) => response.data,
    }),
    getEmployees: builder.mutation<EmployeeInfo[], any>({
      query: (_) => ({
        url: 'employee/all/info',
        method: "GET",
      }),
      transformResponse: (response: { data: EmployeeInfo[] }, _, __) => response.data,
    }),
    getEmployee: builder.mutation<EmployeeInfo, any>({
      query: (data) => ({
        url: 'employee/id',
        method: "POST",
        body:{...data}
      }),
      transformResponse: (response: { data: EmployeeInfo }, _, __) => response.data,
    }),
  }),
});

export const {
  useGetEmployeesByTypeMutation,
  useGetEmployeesByBranchOfficeMutation,
  useRegisterEmployeeScheduleMutation,
  useDeleteEmployeeScheduleMutation,
  useGetEmployeeTypesMutation,
  useRegisterEmployeeMutation,
  useGetEmployeeRolesMutation,
  useGetEmployeesMutation,
  useGetEmployeeMutation,
  useUpdateEmployeeMutation
} = employeeService;
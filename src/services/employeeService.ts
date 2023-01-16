import { Employee } from "../data/employee/employee";
import { EmployeeType } from "../data/employee/employee.types";
import { apiSlice } from "./apiSlice";

export const employeeService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
    //   getEmployeeSchedules: builder.query<SchedulesEmployee[], any>({
    //     query: (_) => ({
    //       url: ApiEndpointsConstants.GET_EMPLOYEE_SCHEDULES,
    //       method: "GET",
    //     }),
    //     transformResponse: (response: { data: SchedulesEmployee[] }, _, __) => response.data,
    //   }),
  
      getEmployeesByType: builder.mutation<Employee[], any>({
        query: (data) => ({
          url: '/employee/byType',
          method: "POST",
          body:{...data}
        }),
        transformResponse: (response: { data: Employee[] }, _, __) => response.data,
      }),
      getEmployeesByBranchOffice: builder.mutation<Employee[], any>({
        query: (data) => ({
          url: '/employee/branchoffice',
          method: "POST",
          body:{...data}
        }),
        transformResponse: (response: { data: Employee[] }, _, __) => response.data,
      }),
      registerEmployeeSchedule: builder.mutation<any, any>({
        query: (data) => ({
          url: '/employee/schedules',
          method: "POST",
          body:{
            "data":data
          }
        }),
        transformResponse: (response: { data: any }, _, __) => response.data,
      }),
  
      deleteEmployeeSchedule: builder.mutation<any, any>({
        query: (data) => ({
          url: '/employee/delete/schedule',
          method: "POST",
          body:{
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
    }),
  });
  
  export const { 
    useGetEmployeesByTypeMutation,
    useGetEmployeesByBranchOfficeMutation,
    useRegisterEmployeeScheduleMutation,
    useDeleteEmployeeScheduleMutation,
    useGetEmployeeTypesMutation
   } = employeeService;
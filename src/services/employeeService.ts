import { Employee } from "../data/employee/employee";
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
    //   registerEmployeesSchedules: builder.mutation<any, any>({
    //     query: (data) => ({
    //       url: ApiEndpointsConstants.REGISTER_EMPLOYEES_SCHEDULE_API,
    //       method: "POST",
    //       body:{
    //         "data":data
    //       }
    //     }),
    //     transformResponse: (response: { data: any }, _, __) => response.data,
    //   }),
  
    //   deleteEmployeesSchedule: builder.mutation<any, any>({
    //     query: (data) => ({
    //       url: ApiEndpointsConstants.DELETE_EMPLOYEES_SCHEDULE_API,
    //       method: "POST",
    //       body:{
    //         ...data
    //       }
    //     }),
    //     transformResponse: (response: { data: any }, _, __) => response.data,
    //   }),
    //   getEmployeesBySchedule: builder.mutation<string[], any>({
    //     query: (data) => ({
    //       url: ApiEndpointsConstants.GET_EMPLOYEE_SCHEDULES_BY_ID,
    //       method: "POST",
    //       body:{
    //         ...data
    //       }
    //     }),
    //     transformResponse: (response: { data: string[] }, _, __) => response.data,
    //   }),
    }),
  });
  
  export const { 
    useGetEmployeesByTypeMutation
   } = employeeService;
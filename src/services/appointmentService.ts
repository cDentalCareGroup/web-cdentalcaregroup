import { AppointmentDetail } from "../data/appointment/appointment.detail";
import { apiSlice } from "./apiSlice";


export const appointmentService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getAppointmentsAvailability: builder.mutation<AvilableTime[], any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.GET_APPOINTMENT_AVAILABILITY_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AvilableTime[] }, meta, arg) => response.data,
    //   invalidatesTags: ['AvilableTime']
    // }),
    // registerAppointment: builder.mutation<string, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.REGISTER_APPOINTMENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: string }, meta, arg) => response.data,
    //   invalidatesTags: ['AvilableTime']
    // }),
    // getAppointmentDetail: builder.query<GetAppointmentDetail, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.GET_APPOINTMENT_DETAIL_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: GetAppointmentDetail }, meta, arg) => response.data,
    // }),
    // getAppointmentDetailPatient: builder.query<AppointmentDetail, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.GET_APPOINTMENT_DETAIL_PATIENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    // }),
    getAppointmentsByBranchOffice: builder.mutation<AppointmentDetail[], any>({
      query: (data) => ({
        url: '/appointment/branchoffice',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail[] }, meta, arg) => response.data,
    }),
    // getAppointmentsByBranchOfficeReceptionist: builder.mutation<AppointmentDetail[], any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.GET_APPOINTMENTS_BY_BRANCH_OFFICE_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AppointmentDetail[] }, meta, arg) => response.data,
    // }),
    registerDentistToAppointment: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/register/dentist',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
      invalidatesTags: ['AppointmentDetail']
    }),
    // updateAppointmentStatus: builder.mutation<AppointmentDetail, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.UPDATE_APPOINTMENT_STATUS_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    //   invalidatesTags: ['AppointmentDetail']
    // }),
    // rescheduleAppointment: builder.mutation<AppointmentDetail, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.RESCHEDULE_APPOINTMENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    //   invalidatesTags: ['AppointmentDetail']
    // }),
    // cancelAppointment: builder.mutation<any, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.CANCEL_APPOINTMENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: any }, meta, arg) => response.data,
    // }),
    // getSchedulesByDentist: builder.mutation<AvilableTime[], any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.GET_SCHEDULES_BY_DENTIST_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: AvilableTime[] }, meta, arg) => response.data,
    // }),
    // registerNextAppointment: builder.mutation<GetAppointmentDetail, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.REGISTER_NEXT_APPOINTMENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: GetAppointmentDetail }, meta, arg) => response.data,
    // }),
    // updateHasLabsAppointment: builder.mutation<any, any>({
    //   query: (data) => ({
    //     url: ApiEndpointsConstants.UPDATE_HASLABS_APPOINTMENT_API,
    //     method: "POST",
    //     body: { ...data },
    //   }),
    //   transformResponse: (response: { data: any }, meta, arg) => response.data,
    // }),
  })
});

export const {
  useGetAppointmentsByBranchOfficeMutation,
  useRegisterDentistToAppointmentMutation
} = appointmentService;
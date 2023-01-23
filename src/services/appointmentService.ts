import { AppointmentDetail } from "../data/appointment/appointment.detail";
import { GetAppointmentDetail } from "../data/appointment/appointment.request";
import { AvailableTime } from "../data/appointment/available.time";
import { PaymentMethod } from "../data/payment/payment.method";
import { Service } from "../data/service/service";
import { apiSlice } from "./apiSlice";


export const appointmentService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentAvailability: builder.mutation<AvailableTime[], any>({
      query: (data) => ({
        url: '/appointment/day/availability',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AvailableTime[] }, meta, arg) => response.data,
      invalidatesTags: ['AvailableTime']
    }),
    registerAppointment: builder.mutation<string, any>({
      query: (data) => ({
        url: '/appointment/register',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: string }, meta, arg) => response.data,
      invalidatesTags: ['AvailableTime']
    }),
    getAppointmentInfo: builder.mutation<GetAppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/detail',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: GetAppointmentDetail }, meta, arg) => response.data,
    }),
    getAppointmentDetailPatient: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/detail/patient',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    }),
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
    updateAppointmentStatus: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/update/status',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
      invalidatesTags: ['AppointmentDetail']
    }),
    rescheduleAppointment: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/reschedule',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
      invalidatesTags: ['AppointmentDetail']
    }),
    cancelAppointment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/appointment/cancel',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: any }, meta, arg) => response.data,
    }),
    getDentistAvailability: builder.mutation<AvailableTime[], any>({
      query: (data) => ({
        url: '/appointment/day/availability/dentist',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AvailableTime[] }, meta, arg) => response.data,
    }),
    registerNextAppointment: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/resgiter/nextappointment',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    }),
    updateHasLabsAppointment: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/update/haslabs',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    }),
    updateHasCabinetAppointment: builder.mutation<AppointmentDetail, any>({
      query: (data) => ({
        url: '/appointment/update/hasCabinet',
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response: { data: AppointmentDetail }, meta, arg) => response.data,
    }),
    getPaymentMethods: builder.mutation<PaymentMethod[], any>({
      query: (_) => ({
        url: '/appointment/paymentmethods',
        method: "GET",
      }),
      transformResponse: (response: { data: PaymentMethod[] }, meta, arg) => response.data,
    }),
    getServices: builder.mutation<Service[], any>({
      query: (_) => ({
        url: '/appointment/services',
        method: "GET",
      }),
      transformResponse: (response: { data: Service[] }, meta, arg) => response.data,
    }),
  })
});

export const {
  useGetAppointmentsByBranchOfficeMutation,
  useRegisterDentistToAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useGetAppointmentAvailabilityMutation,
  useRescheduleAppointmentMutation,
  useGetDentistAvailabilityMutation,
  useRegisterNextAppointmentMutation,
  useRegisterAppointmentMutation,
  useGetAppointmentDetailPatientMutation,
  useCancelAppointmentMutation,
  useUpdateHasLabsAppointmentMutation,
  useGetAppointmentInfoMutation,
  useUpdateHasCabinetAppointmentMutation,
  useGetPaymentMethodsMutation,
  useGetServicesMutation
} = appointmentService;
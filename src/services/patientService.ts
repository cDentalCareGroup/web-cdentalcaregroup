import { Colonies, Colony } from "../data/address/colonies";
import { Patient, PatientInfo } from "../data/patient/patient";
import { PatientOrganization } from "../data/patient/patient.organization";
import { PatientOrigin } from "../data/patient/patient.origin";
import { apiSlice } from "./apiSlice";

export const patientService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getPatientsByBranchOffice: builder.mutation<Patient[], any>({
        query: (data) => ({
          url: '/patient/byBranchOffice',
          method: "POST",
          body: { "branchOffice": data },
        }),
        transformResponse: (response: { data: Patient[] }, meta, arg) => response.data,
        invalidatesTags: ['Patient']
      }),
      getPatients: builder.mutation<Patient[], any>({
        query: (data) => ({
          url: '/patient/filter',
          method: "POST",
          body: {...data}
        }),
        transformResponse: (response: { data: Patient[] }, meta, arg) => response.data,
        invalidatesTags: ['Patient']
      }),
      registerPatient: builder.mutation<Patient, any>({
        query: (data) => ({
          url: '/patient/register',
          method: "POST",
          body: {...data}
        }),
        transformResponse: (response: { data: Patient }, meta, arg) => response.data,
        invalidatesTags: ['Patient']
      }),
      updatePatient: builder.mutation<any, any>({
        query: (data) => ({
          url: '/patient/update',
          method: "POST",
          body: {...data}
        }),
        transformResponse: (response: { data: any }, meta, arg) => response.data,
        invalidatesTags: ['Patient']
      }),
      getPatientOrigins: builder.mutation<PatientOrigin[], any>({
        query: (_) => ({
          url: '/patient/origins',
          method: "GET",
        }),
        transformResponse: (response: { data: PatientOrigin[] }, meta, arg) => response.data,
      }),
      updatePatientStatus: builder.mutation<any, any>({
        query: (data) => ({
          url: '/patient/update/status',
          method: "POST",
          body: {...data}
        }),
        transformResponse: (response: { data: any }, meta, arg) => response.data,
      }),
      getPatient: builder.mutation<PatientInfo, any>({
        query: (data) => ({
          url: '/patient/id',
          method: "POST",
          body: {...data}
        }),
        transformResponse: (response: { data: PatientInfo }, meta, arg) => response.data,
      }),
      getPatientOrganizations: builder.mutation<PatientOrganization[], any>({
        query: (_) => ({
          url: '/patient/organizations',
          method: "GET",
        }),
        transformResponse: (response: { data: PatientOrganization[] }, meta, arg) => response.data,
      }),
      getColoniesFromZipCode: builder.mutation<Colonies, any>({
        query: (data) => ({
          url: '/patient/colonies',
          method: "POST",
          body:{...data}
        }),
        transformResponse: (response: { data: Colonies }, meta, arg) => response.data,
      }),
      updatePatientLatLng: builder.mutation<any, any>({
        query: (data) => ({
          url: '/patient/update/latlng',
          method: "POST",
          body:{...data}
        }),
        transformResponse: (response: { data: any }, meta, arg) => response.data,
      }),
    })
  });
  
  export const { 
    useGetPatientsByBranchOfficeMutation, 
    useGetPatientsMutation, 
    useRegisterPatientMutation,
    useGetPatientOriginsMutation,
    useUpdatePatientStatusMutation,
    useGetPatientMutation,
    useUpdatePatientMutation,
    useGetPatientOrganizationsMutation,
    useGetColoniesFromZipCodeMutation,
    useUpdatePatientLatLngMutation
  } = patientService;
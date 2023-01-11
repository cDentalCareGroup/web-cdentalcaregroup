import { Patient } from "../data/patient/patient";
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
    })
  });
  
  export const { useGetPatientsByBranchOfficeMutation, useGetPatientsMutation } = patientService;
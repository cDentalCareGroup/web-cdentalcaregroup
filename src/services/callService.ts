import { CallCatalog } from "../data/call/call.catalog";
import { GetCallDetail, GetCalls } from "../data/call/call.response";
import { apiSlice } from "./apiSlice";

export const callService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCalls: builder.mutation<GetCalls[], any>({
            query: (_) => ({
                url: '/calls',
                method: "GET",
            }),
            transformResponse: (response: { data: GetCalls[] }, _, __) => response.data,
        }),
        getCatalogs: builder.mutation<CallCatalog[], any>({
            query: (_) => ({
                url: '/calls/catalogs',
                method: "GET",
            }),
            transformResponse: (response: { data: CallCatalog[] }, _, __) => response.data,
        }),
        updateCall: builder.mutation<any, any>({
            query: (data) => ({
                url: '/calls/update',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
        notAttendedCall: builder.mutation<any, any>({
            query: (data) => ({
                url: '/calls/notattended',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
        updateCatalog: builder.mutation<any, any>({
            query: (data) => ({
                url: '/calls/update/catalog',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
        registerCatalog: builder.mutation<any, any>({
            query: (data) => ({
                url: '/calls/register/catalog',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
        registerCall: builder.mutation<any, any>({
            query: (data) => ({
                url: '/calls/register',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any }, _, __) => response.data,
        }),
        getCallDetail: builder.mutation<GetCallDetail, any>({
            query: (data) => ({
                url: '/calls/detail',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: GetCallDetail }, _, __) => response.data,
        }),
    }),
});

export const {
   useGetCallsMutation,
   useGetCatalogsMutation,
   useUpdateCallMutation,
   useUpdateCatalogMutation,
   useRegisterCatalogMutation,
   useRegisterCallMutation,
   useGetCallDetailMutation,
   useNotAttendedCallMutation
} = callService;
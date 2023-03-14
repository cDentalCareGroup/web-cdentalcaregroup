import { Origin } from "../data/origins/origin";
import { apiSlice } from "./apiSlice";

export const originService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrigins: builder.mutation<Origin[], any>({
            query: (_) => ({
                url: '/origins',
                method: "GET",
            }),
            transformResponse: (response: { data: Origin[] }, meta, arg) => response.data,
        }),

        registerOrigin: builder.mutation<Origin, any>({
            query: (data) => ({
                url: '/origins/register',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: Origin }, meta, arg) => response.data,
        }),
        updateOrigin: builder.mutation<Origin, any>({
            query: (data) => ({
                url: '/origins/update',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: Origin }, meta, arg) => response.data,
        }),
    })
});

export const {
   useGetOriginsMutation,
   useRegisterOriginMutation,
   useUpdateOriginMutation
} = originService;
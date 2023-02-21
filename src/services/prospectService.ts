import { Prospect } from "../data/prospect/prospect";
import { apiSlice } from "./apiSlice";

export const prospectService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProspects: builder.mutation<Prospect[], any>({
            query: (_) => ({
                url: '/prospect/',
                method: "GET",
            }),
            transformResponse: (response: { data: Prospect[] }, meta, arg) => response.data,
            invalidatesTags: ['Prospect']
        }),
        registerProspect: builder.mutation<Prospect, any>({
            query: (data) => ({
                url: '/prospect/register',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: Prospect }, meta, arg) => response.data,
            invalidatesTags: ['Prospect']
        }),
    })
});

export const {
    useGetProspectsMutation,
    useRegisterProspectMutation
} = prospectService;
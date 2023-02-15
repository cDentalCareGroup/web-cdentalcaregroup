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
    })
});

export const {
    useGetProspectsMutation
} = prospectService;
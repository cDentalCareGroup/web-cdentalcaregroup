import { Organization } from "../data/organization/organization";
import { apiSlice } from "./apiSlice";

export const organizationService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrganizations: builder.mutation<Organization[], any>({
            query: (_) => ({
                url: '/organization',
                method: "GET",
            }),
            transformResponse: (response: { data: Organization[] }, meta, arg) => response.data,
        }),

        registerOrganization: builder.mutation<Organization, any>({
            query: (data) => ({
                url: '/organization/register',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: Organization }, meta, arg) => response.data,
        }),
        updateOrganization: builder.mutation<Organization, any>({
            query: (data) => ({
                url: '/organization/update',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: Organization }, meta, arg) => response.data,
        }),
    })
});

export const {
   useGetOrganizationsMutation,
   useRegisterOrganizationMutation,
   useUpdateOrganizationMutation
} = organizationService;
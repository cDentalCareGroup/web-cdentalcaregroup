import { BranchOffice } from "../data/branchoffice/branchoffice";
import { apiSlice } from "./apiSlice";

export const branchOfficeService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBranchOffices: builder.mutation<BranchOffice[], any>({
            query: (_) => ({
                url: '/branchoffice/all',
                method: "GET",
            }),
            transformResponse: (response: { data: BranchOffice[] }, _, __) => response.data,
        }),
    }),
});

export const {
    useGetBranchOfficesMutation
} = branchOfficeService;
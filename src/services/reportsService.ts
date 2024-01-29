import { Reports } from "../data/reports/report";
import { apiSlice } from "./apiSlice";

export const reportService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postReports: builder.mutation<Reports[], any>({
            query: (data) => ({
                url: '/reports/patientsDates',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: Reports[] }, meta, arg) => response.data,

        })
    })
});


export const {
    usePostReportsMutation,
} = reportService;

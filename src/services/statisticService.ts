import { PaymentType } from "../data/payment/payment.types";
import { GetCallsReports, GetStatisticsCalls } from "../data/statistics/statistic.calls";
import { apiSlice } from "./apiSlice";

export const statisticService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // getStatistics: builder.mutation<any, any>({
        //     query: (_) => ({
        //         url: '/statistic',
        //         method: "GET",
        //     }),
        //     transformResponse: (response: { data: any }, meta, arg) => response.data,
        // }),
        // getCallStatistics: builder.mutation<GetStatisticsCalls, any>({
        //     query: (_) => ({
        //         url: '/statistic/calls',
        //         method: "GET",
        //     }),
        //     transformResponse: (response: { data: GetStatisticsCalls }, meta, arg) => response.data,
        // }),
        // getPaymentsStatistics: builder.mutation<any[], any>({
        //     query: (_) => ({
        //         url: '/statistic/balance',
        //         method: "GET",
        //     }),
        //     transformResponse: (response: { data: any[] }, meta, arg) => response.data,
        // }),
        getCallsReport: builder.mutation<GetCallsReports[], any>({
            query: (_) => ({
                url: '/statistic/reports/calls',
                method: "GET",
            }),
            transformResponse: (response: { data: GetCallsReports[] }, meta, arg) => response.data,
        }),
        getServiceSalesReport: builder.mutation<any[], any>({
            query: (data) => ({
                url: '/statistic/reports/services/sales',
                method: "POST",
                body:{...data}
            }),
            transformResponse: (response: { data: any[] }, meta, arg) => response.data,
        }),

    })
});

export const {
    //    useGetStatisticsMutation,
    //    useGetCallStatisticsMutation,
    //    useGetPaymentsStatisticsMutation
    useGetCallsReportMutation,
    useGetServiceSalesReportMutation
} = statisticService;

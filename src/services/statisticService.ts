import { PaymentType } from "../data/payment/payment.types";
import { GetStatisticsCalls } from "../data/statistics/statistic.calls";
import { apiSlice } from "./apiSlice";

export const statisticService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.mutation<any, any>({
            query: (_) => ({
                url: '/statistic',
                method: "GET",
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
        }),
        getCallStatistics: builder.mutation<GetStatisticsCalls, any>({
            query: (_) => ({
                url: '/statistic/calls',
                method: "GET",
            }),
            transformResponse: (response: { data: GetStatisticsCalls }, meta, arg) => response.data,
        }),
    })
});

export const {
   useGetStatisticsMutation,
   useGetCallStatisticsMutation
} = statisticService;
import { PaymentType } from "../data/payment/payment.types";
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
    })
});

export const {
   useGetStatisticsMutation
} = statisticService;
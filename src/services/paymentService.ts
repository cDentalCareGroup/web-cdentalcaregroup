import { PaymentType } from "../data/payment/payment.types";
import { apiSlice } from "./apiSlice";

export const paymentService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentTypes: builder.mutation<PaymentType[], any>({
            query: (_) => ({
                url: '/payment/types',
                method: "GET",
            }),
            transformResponse: (response: { data: PaymentType[] }, meta, arg) => response.data,
        }),
    })
});

export const {
   useGetPaymentTypesMutation
} = paymentService;
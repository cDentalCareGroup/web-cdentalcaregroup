import { PaymentInfo } from "../data/payment/payment.info";
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
        getPatientPayments: builder.mutation<PaymentInfo, any>({
            query: (data) => ({
                url: '/payment/patient',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: PaymentInfo }, meta, arg) => response.data,
        }),
        registerPatientMovement: builder.mutation<any, any>({
            query: (data) => ({
                url: '/payment/patient/register/movement',
                method: "POST",
                body: { ...data }
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
        }),
    })
});

export const {
    useGetPaymentTypesMutation,
    useGetPatientPaymentsMutation,
    useRegisterPatientMovementMutation
} = paymentService;
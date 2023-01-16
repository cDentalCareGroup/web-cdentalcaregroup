import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const DEV = "http://localhost:3000"
const PROD = "https://service-c-dental-care-group-production.up.railway.app";
const DEV_PROD = "https://service-c-dental-care-group-dev.up.railway.app";

const baseQuery = fetchBaseQuery({
    baseUrl: DEV_PROD,
    credentials: 'same-origin',
    prepareHeaders: (headers, { getState }) => {
        const { auth }: any = getState();
        if (auth.user && auth.user.token) {
            headers.set("Authorization",`Bearer ${auth.user.token}`)
        }
        headers.set("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        return headers;
    },
});

export const apiSlice = createApi({
    baseQuery: baseQuery,
    tagTypes: ['User','BranchOffice','Patient','AppointmentDetail','AvailableTime'],
    endpoints: builder => ({})
});
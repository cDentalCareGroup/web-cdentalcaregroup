import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const LOCAL_DEV = "http://localhost:3000"
const PROD = "https://cdental-care-group-production.up.railway.app";
const DEV = "https://cdental-care-group-development.up.railway.app";

const baseQuery = fetchBaseQuery({
    baseUrl: DEV,
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
    tagTypes: ['User','BranchOffice','Patient','AppointmentDetail','Prospect','AvailableTime'],
    endpoints: builder => ({})
});
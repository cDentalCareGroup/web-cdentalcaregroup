import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LOCAL_DEV = "http://localhost:3000";

const getUrl = (): string => {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return LOCAL_DEV;
  } else {
    return import.meta.env.VITE_URL_SERVICE;
  }
};
const baseQuery = fetchBaseQuery({
  baseUrl: getUrl(),
  credentials: "same-origin",
  prepareHeaders: (headers, { getState }) => {
    const { auth }: any = getState();
    if (auth.user && auth.user.token) {
      headers.set("Authorization", `Bearer ${auth.user.token}`);
    }
    headers.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: [
    "User",
    "BranchOffice",
    "Patient",
    "AppointmentDetail",
    "Prospect",
    "AvailableTime",
  ],
  endpoints: (builder) => ({}),
});

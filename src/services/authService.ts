import User from "../data/user/user";
import { LoginRequest } from "../data/user/user.request";
import { apiSlice } from "./apiSlice";

export const authService = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (credentials: LoginRequest) => ({
          url: '/auth/login',
          method: "POST",
          body: { ...credentials },
        }),
        transformResponse: (response: { data: User }, meta, arg) => response.data,
        invalidatesTags: ['User']
      }),
      saveToken: builder.mutation<any, any>({
        query: (data) => ({
          url: '/auth/token',
          method: "POST",
          body: { ...data },
        }),
        transformResponse: (response: { data: any }, meta, arg) => response.data,
      }),
      updatePassowrd: builder.mutation<any, any>({
        query: (data) => ({
          url: '/auth/update/password',
          method: "POST",
          body: { ...data },
        }),
        transformResponse: (response: { data: any }, meta, arg) => response.data,
      }),
    })
  });

  export const { useLoginMutation, useSaveTokenMutation, useUpdatePassowrdMutation } = authService;
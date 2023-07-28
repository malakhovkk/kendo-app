import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery(
    { 
        baseUrl: "http://192.168.20.30:55555/api/",
        prepareHeaders: (headers, { getState }) => {
            headers.set('Accept', '*/*')
            headers.set('Host', '192.168.20.39')
            return headers
        }
    },
  ),

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (user) => ({
        url: "user",
        method: 'GET',
      }),
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: 'PUT',
        body: user,
      }),
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: 'POST',
        body: user,
      }),
    }),
    // getProduct: builder.query({
    //   query: (product) => `products/search?q=${product}`, 
    // }),
  }),
});

export const { useGetAllUsersQuery, useEditUserMutation, useCreateUserMutation   } = userApi;
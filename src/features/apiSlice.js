import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users", "Groups", "LinkGroup"],
  baseQuery: fetchBaseQuery(
    { 
        baseUrl: "http://192.168.20.30:55555/api/",
        prepareHeaders: (headers, { getState }) => {
            headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
            headers.set('User', `${localStorage.getItem('login')}`)
            return headers
        }
    },
  ),

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "user",
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: 'POST',
        body: user,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    deleteUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: 'DELETE',
        body: user,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    getAllGroups: builder.query({
      query: (user) => ({
        url: "groups",
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Groups', id })),
              { type: 'Groups', id: 'LIST' },
            ]
          : [{ type: 'Groups', id: 'LIST' }],
    }),
    editGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),
    createGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: 'POST',
        body: user,
      }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),
    deleteGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: 'DELETE',
        body: user,
      }),
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),

    getAllRights: builder.query({
      query: (user) => ({
        url: "rights",
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Rights', id })),
              { type: 'Rights', id: 'LIST' },
            ]
          : [{ type: 'Rights', id: 'LIST' }],
    }),
    editRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: [{ type: 'Rights', id: 'LIST' }],
    }),
    createRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: 'POST',
        body: user,
      }),
      invalidatesTags: [{ type: 'Rights', id: 'LIST' }],
    }),
    deleteRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: 'DELETE',
        body: user,
      }),
      invalidatesTags: [{ type: 'Rights', id: 'LIST' }],
    }),
    addUserToGroup: builder.mutation({
      query: (linkData) => ({
        url: "UserGroup",
        method: 'POST',
        body: linkData,
      }),
      invalidatesTags: [{ type: 'LinkGroup', id: 'LIST' }],
    }),
    getUsersByGroup: builder.mutation({
      query: (user) => ({
        url: `UserGroup/${user.id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'LinkGroup', id })),
              { type: 'LinkGroup', id: 'LIST' },
            ]
          : [{ type: 'LinkGroup', id: 'LIST' }],
    }),
    removeUserFromGroup: builder.mutation({
      query: (body) => ({
        url: "UserGroup",
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'LinkGroup', id: 'LIST' }],
    }),


    addRightToGroup: builder.mutation({
      query: (linkData) => ({
        url: "GroupRight",
        method: 'POST',
        body: linkData,
      }),
      invalidatesTags: [{ type: 'GroupRight', id: 'LIST' }],
    }),
    getRightsByGroup: builder.mutation({
      query: (user) => ({
        url: `GroupRight/${user.id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'GroupRight', id })),
              { type: 'GroupRight', id: 'LIST' },
            ]
          : [{ type: 'GroupRight', id: 'LIST' }],
    }),
    removeRightFromGroup: builder.mutation({
      query: (body) => ({
        url: "GroupRight",
        method: 'DELETE',
        body,
      }),
      invalidatesTags: [{ type: 'GroupRight', id: 'LIST' }],
    }),
    logon: builder.mutation({
      query: (user) => ({
        url: "logon",
        method: 'POST',
        body: user,
      }),
    })
    // getProduct: builder.query({
    //   query: (product) => `products/search?q=${product}`, 
    // }),
  }),
});

export const { 
    useGetAllUsersQuery,
    useEditUserMutation, 
    useCreateUserMutation,
    useDeleteUserMutation, 
    useGetAllGroupsQuery, 
    useEditGroupMutation, 
    useCreateGroupMutation,
    useDeleteGroupMutation, 
    useGetAllRightsQuery, 
    useEditRightMutation, 
    useCreateRightMutation,
    useDeleteRightMutation,
    useAddUserToGroupMutation,
    useLogonMutation,
    useGetUsersByGroupMutation,
    useRemoveUserFromGroupMutation,
    useRemoveRightFromGroupMutation,
    useGetRightsByGroupMutation,
    useAddRightToGroupMutation  } = userApi;
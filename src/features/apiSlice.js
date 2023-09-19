import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users", "Groups", "LinkGroup", "Files"],
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://192.168.20.30:55555/api/",
    baseUrl: "https://194.87.239.231:44444/api/",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
      headers.set("User", `${localStorage.getItem("login")}`);
      //console.log(getState)
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Users", id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    editUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (user) => ({
        url: "user",
        method: "DELETE",
        body: user,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    getAllGroups: builder.query({
      query: (user) => ({
        url: "groups",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Groups", id })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),
    editGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),
    createGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),
    deleteGroup: builder.mutation({
      query: (user) => ({
        url: "groups",
        method: "DELETE",
        body: user,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    getAllRights: builder.query({
      query: (user) => ({
        url: "rights",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Rights", id })),
              { type: "Rights", id: "LIST" },
            ]
          : [{ type: "Rights", id: "LIST" }],
    }),
    editRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: [{ type: "Rights", id: "LIST" }],
    }),
    createRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: "POST",
        body: user,
      }),
      invalidatesTags: [{ type: "Rights", id: "LIST" }],
    }),
    deleteRight: builder.mutation({
      query: (user) => ({
        url: "rights",
        method: "DELETE",
        body: user,
      }),
      invalidatesTags: [{ type: "Rights", id: "LIST" }],
    }),
    addUserToGroup: builder.mutation({
      query: (linkData) => ({
        url: "UserGroup",
        method: "POST",
        body: linkData,
      }),
      invalidatesTags: [{ type: "LinkGroup", id: "LIST" }],
    }),
    getUsersByGroup: builder.mutation({
      query: (user) => ({
        url: `UserGroup/${user.id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "LinkGroup", id })),
              { type: "LinkGroup", id: "LIST" },
            ]
          : [{ type: "LinkGroup", id: "LIST" }],
    }),
    removeUserFromGroup: builder.mutation({
      query: (body) => ({
        url: "UserGroup",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [{ type: "LinkGroup", id: "LIST" }],
    }),

    addRightToGroup: builder.mutation({
      query: (linkData) => ({
        url: "GroupRight",
        method: "POST",
        body: linkData,
      }),
      invalidatesTags: [{ type: "GroupRight", id: "LIST" }],
    }),
    getRightsByGroup: builder.mutation({
      query: (user) => ({
        url: `GroupRight/${user.id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "GroupRight", id })),
              { type: "GroupRight", id: "LIST" },
            ]
          : [{ type: "GroupRight", id: "LIST" }],
    }),
    removeRightFromGroup: builder.mutation({
      query: (body) => ({
        url: "GroupRight",
        method: "DELETE",
        body,
      }),
      invalidatesTags: [{ type: "GroupRight", id: "LIST" }],
    }),
    logon: builder.mutation({
      query: (user) => ({
        url: "logon",
        method: "POST",
        body: user,
      }),
    }),
    upload: builder.mutation({
      query: (doc) => ({
        url: "file",
        method: "POST",
        body: doc,
      }),
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
    getVendors: builder.query({
      query: () => ({
        url: "vendor",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Vendors", id })),
              { type: "Vendors", id: "LIST" },
            ]
          : [{ type: "Vendors", id: "LIST" }],
    }),
    editVendor: builder.mutation({
      query: (vendor) => ({
        url: "vendor",
        method: "PUT",
        body: vendor,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),
    createVendor: builder.mutation({
      query: (vendor) => ({
        url: "vendor",
        method: "POST",
        body: vendor,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),
    deleteVendor: builder.mutation({
      query: (vendor) => ({
        url: "vendor",
        method: "DELETE",
        body: vendor,
      }),
      invalidatesTags: [{ type: "Vendors", id: "LIST" }],
    }),
    getProfiles: builder.query({
      query: () => ({
        url: "Profile",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Profiles", id })),
              { type: "Profiles", id: "LIST" },
            ]
          : [{ type: "Profiles", id: "LIST" }],
    }),
    addProfile: builder.mutation({
      query: (profile) => ({
        url: "Profile",
        method: "POST",
        body: profile,
      }),
      invalidatesTags: [{ type: "Profiles", id: "LIST" }],
    }),
    getDocument: builder.mutation({
      query: ({ id }) => ({
        url: `Document/${id}`,
        method: "GET",
      }),
      invalidatesTags: [{ type: "Documents", id: "LIST" }],
      // providesTags: (result) =>
      //   result
      //     ? [
      //         ...result.map(({ id }) => ({ type: 'Documents', id })),
      //         { type: 'Documents', id: 'LIST' },
      //       ]
      //     : [{ type: 'Documents', id: 'LIST' }]
    }),
    getDictionary: builder.query({
      query: () => ({
        url: "Dictionary",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Dictionary", id })),
              { type: "Dictionary", id: "LIST" },
            ]
          : [{ type: "Dictionary", id: "LIST" }],
    }),
    getDictionaryById: builder.mutation({
      query: ({ id }) => ({
        url: `Dictionary/${id}`,
        method: "GET",
      }),
    }),
    editRecord: builder.mutation({
      query: (record) => ({
        url: "Document",
        method: "PUT",
        body: record,
      }),
      invalidatesTags: [{ type: "Documents", id: "LIST" }],
    }),
    deleteRecords: builder.mutation({
      query: (records) => ({
        url: "Document",
        method: "DELETE",
        body: records,
      }),
      invalidatesTags: [{ type: "Documents", id: "LIST" }],
    }),
    getFiles: builder.query({
      query: () => ({
        url: "file",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Files", id })),
              { type: "Files", id: "LIST" },
            ]
          : [{ type: "Files", id: "LIST" }],
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `file/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
    deleteDictionary: builder.mutation({
      query: (record) => ({
        url: `Dictionary`,
        method: "DELETE",
        body: record,
      }),
      invalidatesTags: [{ type: "Dictionary", id: "LIST" }],
    }),
    editDictionary: builder.mutation({
      query: (record) => ({
        url: `Dictionary`,
        method: "PUT",
        body: record,
      }),
      invalidatesTags: [{ type: "Dictionary", id: "LIST" }],
    }),
    addToStock: builder.mutation({
      query: (doc_id) => ({
        url: `Document/${doc_id}`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Stock", id: "LIST" }],
    }),
    getVendorContacts: builder.mutation({
      query: ({ id }) => ({
        url: `vendorcontact/${id}`,
        method: "GET",
      }),
      invalidatesTags: [{ type: "VendorContact", id: "LIST" }],
    }),
    removeVendorContacts: builder.mutation({
      query: ({ id }) => ({
        url: `vendorcontact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "VendorContact", id: "LIST" }],
    }),
    editVendorContacts: builder.mutation({
      query: (contact) => ({
        url: `vendorcontact`,
        method: "PUT",
        body: contact,
      }),
      invalidatesTags: [{ type: "VendorContact", id: "LIST" }],
    }),
    getOrders: builder.mutation({
      query: (vendorId) => ({
        url: `order/${vendorId}`,
        method: "GET",
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    createOrder: builder.mutation({
      query: (vendorId) => ({
        url: `order/${vendorId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    saveOrder: builder.mutation({
      query: ({ body }) => ({
        url: `orderContent/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    getOrder: builder.mutation({
      query: (orderId) => ({
        url: `orderContent/${orderId}`,
        method: "GET",
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    saveEditOrder: builder.mutation({
      query: ({ body }) => ({
        url: `orderContent/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

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
  useAddRightToGroupMutation,
  useUploadMutation,
  useGetVendorsQuery,
  useEditVendorMutation,
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useGetProfilesQuery,
  useAddProfileMutation,
  useGetDocumentMutation,
  useGetDictionaryQuery,
  useEditRecordMutation,
  useDeleteRecordsMutation,
  useGetFilesQuery,
  useDeleteFileMutation,
  useDeleteDictionaryMutation,
  useEditDictionaryMutation,
  useAddToStockMutation,
  useGetVendorContactsMutation,
  useRemoveVendorContactsMutation,
  useEditVendorContactsMutation,
  useGetOrdersMutation,
  useGetDictionaryByIdMutation,
  useCreateOrderMutation,
  useSaveOrderMutation,
  useGetOrderMutation,
  useSaveEditOrderMutation,
} = userApi;

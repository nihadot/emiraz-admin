import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../api';

export const partnersApi = createApi({
  reducerPath: 'partnersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/partners` }), // Replace with your API URL
  tagTypes: ['Partners'],
  endpoints: (builder) => ({
    addPartners: builder.mutation({
      query: (credentials) => ({
        url: '/',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Partners'],
    }),
    getAllPartners: builder.query({
      query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      providesTags: ['Partners'],
    }),
    getPartners: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Partners', id }],
    }),    
    updatePartners: builder.mutation<void, { id: string; data }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Partners', id }],
    }),
    deletePartners: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Partners', id }],
    }),
  }),
});

export const { 
  useGetPartnersQuery,
  useGetAllPartnersQuery,
  useAddPartnersMutation,
  useUpdatePartnersMutation,
  useDeletePartnersMutation
} = partnersApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../api';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/news` }), // Replace with your API URL
  tagTypes: ['News'],
  endpoints: (builder) => ({
    addNews: builder.mutation({
      query: (credentials) => ({
        url: '/',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['News'],
    }),
    getAllNews: builder.query({
      query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      providesTags: ['News'],
    }),
    getNews: builder.query({
      query: (id) => `/${id}`,
      providesTags: (id) => [{ type: 'News', id }],
    }),    
    updateNews: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ({ id }) => [{ type: 'News', id }],
    }),
    deleteNews: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (id) => [{ type: 'News', id }],
    }),
  }),
});
// console.log('first')

export const { 
  useGetNewsQuery, 
  useAddNewsMutation, 
  useGetAllNewsQuery, 
  useDeleteNewsMutation, 
  useUpdateNewsMutation 
} = newsApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../api';

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/gallery` }), // Replace with your API URL
  tagTypes: ['Galley'],
  endpoints: (builder) => ({
    addGallery: builder.mutation({
      query: (credentials) => ({
        url: '/',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Galley'],
    }),
    getAllGallery: builder.query({
      query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      providesTags: ['Galley'],
    }),
    getGallery: builder.query({
      query: (id) => `/${id}`,
      providesTags: ( id) => [{ type: 'Galley', id }],
    }),    
    updateGallery: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ({ id }) => [{ type: 'Galley', id }],
    }),
    deleteGallery: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (id) => [{ type: 'Galley', id }],
    }),
  }),
});
// console.log('first')

export const { 
  useGetGalleryQuery,
  useGetAllGalleryQuery,
  useAddGalleryMutation,
  useDeleteGalleryMutation,
  useUpdateGalleryMutation,

} = galleryApi;
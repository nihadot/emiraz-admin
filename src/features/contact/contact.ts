import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../api';
import { Contact } from '../blog/blogApi';

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/contact-us` }), // Replace with your API URL
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getContacts: builder.query<Contact[], { page: number; limit: number }>({
         query: ({ page, limit }) => {
           // Send page and limit as query parameters
           return `/?page=${page}&limit=${limit}`;
         },
         providesTags: ['Contact'],
       }),
  }),
});

export const { useGetContactsQuery } = contactApi;

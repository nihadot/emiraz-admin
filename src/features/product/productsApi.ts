import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../api';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}/products` }), // Replace with your API URL
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (credentials) => ({
        url: '/',
        method: 'POST',
        body: credentials,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Products'],
    }),
    getAllProducts: builder.query({
      query: ({ page, limit }) => `/?page=${page}&limit=${limit}`,
      providesTags: ['Products'],
    }),
    getProduct: builder.query({
      query: (id) => `/${id}`,
      providesTags: (id) => [{ type: 'Products', id }],
    }),    
    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ( { id }) => [{ type: 'Products', id }],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),
  }),
});
// console.log('first')

export const { 
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useUpdateProductMutation
} = productsApi;
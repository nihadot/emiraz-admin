import NewsCard from '@/components/NewsCard/NewsCard';
import PartnersCard from '@/components/PartnersCard/PartnersCard';
import ProductsCard from '@/components/ProductsCard/ProductsCard';
import { errorToast, successToast } from '@/components/Toast';
import { useDeletePartnersMutation, useGetAllPartnersQuery } from '@/features/partners/partnersApi';
import { useDeleteProductMutation, useGetAllProductsQuery } from '@/features/product/productsApi';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';

type Props = {}

function AllProducts({ }: Props) {



  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]); // State to hold all partners
  const [loading, setLoading] = useState(true); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there are more partners items to load
  const { state } = useLocation();



  const { data, isLoading, refetch } = useGetAllProductsQuery({ page, limit: 10 });
  const [deleteProducts, { }] =
    useDeleteProductMutation();



  useEffect(() => {
    if (data) {
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...data.data]); // Append new partners items
      }
      setLoading(false); // Stop loading when data is received
    }

  }, [data]);


  // Effect to detect when the user reaches the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 && // 200px before bottom
        !loading &&
        hasMore
      ) {
        setLoading(true); // Start loading more news
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup event listener
    };
  }, [loading, hasMore]);





  const handleDelete = async (id: string) => {
    const status = window.confirm("Are you sure you want to delete this product?");
    if (!status) {
      return;
    }
    try {
      await deleteProducts(id).unwrap();
      successToast("Products deleted successfully!");

      // Remove the deleted news from the state
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      if (err?.data?.message) {
        errorToast(err?.data?.message);
      } else if (Array.isArray(err?.data?.errors)) {
        for (const item of err.data.errors) {
          errorToast(item.msg);
        }
      }
    }
  };

  // Effect to handle refetching when `state.refetch` changes
  useEffect(() => {
    if (state?.refetch) {
      setPage(1); // Reset page number to 1
      setProducts([]); // Reset news list
      setHasMore(true); // Ensure there's more data to load
      setLoading(true); // Start loading again
      refetch(); // Trigger refetch to reload news
    }
  }, [state, refetch]);


  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-8 h-screen ">
        {Array.from({ length: 12 })
          .fill(null)
          .map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-xl h-[300px] w-full"></div>
          ))}
      </div>
    );
  }


  if (products.length === 0) {
    return <div>No products available.</div>;
  }


  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {products.map((item) => (
          <ProductsCard
            handleDelete={() => handleDelete(item._id)}
            key={item._id}
            item={item}
          />
        ))}
      </div>

      {/* Show loading indicator when fetching more data */}
      {loading && <div>Loading more products...</div>}

      {/* Show message when no more data */}
      {!hasMore && <div className="text-center py-8">No more products to load.</div>}
    </div>
  )
}

export default AllProducts
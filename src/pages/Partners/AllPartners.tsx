import PartnersCard, { Partners } from '@/components/PartnersCard/PartnersCard';
import { errorToast, successToast } from '@/components/Toast';
import { useDeletePartnersMutation, useGetAllPartnersQuery } from '@/features/partners/partnersApi';
import  { useEffect, useState } from 'react'
import { useLocation } from 'react-router';

type Props = {}

function AllPartners({}: Props) {



    const [page, setPage] = useState(1);
    const [partners, setPartners] = useState<any>([]); // State to hold all partners
    const [loading, setLoading] = useState(true); // Track loading state
    const [hasMore, setHasMore] = useState(true); // Track if there are more partners items to load
    const { state } = useLocation();



      const { data,  isLoading, refetch } = useGetAllPartnersQuery({ page, limit: 10 });
      const [deletePartners, {  }] =
        useDeletePartnersMutation();
    


          useEffect(() => {
            if (data) {
              if (data.data.length === 0) {
                setHasMore(false);
              } else {
                setPartners((prevPartners:any) => [...prevPartners, ...data.data]); // Append new partners items
              }
              setLoading(false); // Stop loading when data is received
            }
        
            return ()=>{
              // setNews([]);
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
      const status = window.confirm("Are you sure you want to delete this partner item?");
      if (!status) {
        return;
      }
      try {
        await deletePartners(id).unwrap();
        successToast("Partners deleted successfully!");
  
        // Remove the deleted news from the state
        setPartners((prevPartners: any[]) => prevPartners.filter((item) => item._id !== id));
      } catch (err:any) {
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
          setPartners([]); // Reset news list
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
              .map((_item, index) => (
                <div key={index} className="bg-slate-50 rounded-xl h-[300px] w-full"></div>
              ))}
          </div>
        );
      }


  if (partners.length === 0) {
    return <div>No partners available.</div>;
  }


  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {partners.map((item: Partners) => (
          <PartnersCard
            handleDelete={() => handleDelete(item._id)}
            key={item._id}
            item={item}
          />
        ))}
      </div>

      {/* Show loading indicator when fetching more data */}
      {loading && <div>Loading more partners...</div>}

      {/* Show message when no more data */}
      {!hasMore && <div className="text-center py-8">No more partners to load.</div>}
    </div>
  )
}

export default AllPartners
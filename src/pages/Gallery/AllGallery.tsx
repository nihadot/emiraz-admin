import { useState, useEffect } from "react";
import { errorToast, successToast } from "@/components/Toast";
import { useLocation } from "react-router";
import { useDeleteGalleryMutation, useGetAllGalleryQuery } from "@/features/gallery/galleryApi";
import GalleryCard, { Gallery } from "@/components/Gallery/GalleryCard";

type Props = {};

function AllGallery({ }: Props) {
 
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState<any>([]); // State to hold all gallery
  const [loading, setLoading] = useState(true); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there are more gallery to load
  const { state } = useLocation();
  const { data, isLoading, refetch } = useGetAllGalleryQuery({ page, limit: 10 });
  const [deleteGallery, {  }] = useDeleteGalleryMutation();

  // Effect to fetch data when `data` is available or refetch is triggered
  useEffect(() => {   
    if (data) {
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setGallery((prevGallery: any) => [...prevGallery, ...data.data]); // Append new gallery
      }
      setLoading(false); // Stop loading when data is received
    }

    return ()=>{
    //   setGallery([]);
    }
  }, [data]);

//   console.log(gallery,'gallery')

  // Effect to detect when the user reaches the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 && // 200px before bottom
        !loading &&
        hasMore
      ) {
        setLoading(true); // Start loading more gallery
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup event listener
    };
  }, [loading, hasMore]);

  // Effect to handle refetching when `state.refetch` changes
  useEffect(() => {
    if (state?.refetch) {
      setPage(1); // Reset page number to 1
      setGallery([]); // Reset gallery list
      setHasMore(true); // Ensure there's more data to load
      setLoading(true); // Start loading again
      refetch(); // Trigger refetch to reload gallery
    }
  }, [state, refetch]);
  const handleDelete = async (id: string) => {
    const status = window.confirm("Are you sure you want to delete this?");
    if (!status) {
      return;
    }
    try {
      await deleteGallery(id).unwrap();
      successToast("Gallery deleted successfully!");

      // Remove the deleted gallery from the state
      setGallery((prevGallery: any[]) => prevGallery.filter((gallery) => gallery._id !== id));
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

  if (gallery.length === 0) {
    return <div className="w-full h-screen justify-center items-center flex">No data available.</div>;
  }

 

  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {gallery.map((item: Gallery) => (
          <GalleryCard
            handleDelete={() => handleDelete(item._id)}
            key={item._id} // Ensure `id` exists in your item type
            item={item}
          />
        ))}
      </div>

      {/* Show loading indicator when fetching more data */}
      {loading && <div>Loading more galleries...</div>}

      {/* Show message when no more data */}
      {!hasMore && <div className="text-center py-8">No more galleries to load.</div>}
    </div>
  );
}

export default AllGallery;

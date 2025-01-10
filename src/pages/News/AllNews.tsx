import NewsCard from "../../components/NewsCard/NewsCard";
import { useState, useEffect } from "react";
import { errorToast, successToast } from "@/components/Toast";
import { useLocation } from "react-router";
import { useDeleteNewsMutation, useGetAllNewsQuery } from "@/features/news/newsApi";

type Props = {};

function AllNews({ }: Props) {

  const [page, setPage] = useState(1);
  const [news, setNews] = useState<any[]>([]); // State to hold all news
  const [loading, setLoading] = useState(true); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there are more news items to load
  const { state } = useLocation();

  const { data, isLoading, refetch } = useGetAllNewsQuery({ page, limit: 10 });
  const [deleteNews] =
    useDeleteNewsMutation();

  // Effect to fetch data when `data` is available or refetch is triggered
  useEffect(() => {
    if (data) {
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setNews((prevNews) => [...prevNews, ...data.data]); // Append new news items
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

  // Effect to handle refetching when `state.refetch` changes
  useEffect(() => {
    if (state?.refetch) {
      setPage(1); // Reset page number to 1
      setNews([]); // Reset news list
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
            <div key={index} className="bg-slate-50 rounded-xl h-[468px] w-full"></div>
          ))}
      </div>
    );
  }

  if (news.length === 0) {
    return <div>No news available.</div>;
  }

  const handleDelete = async (id: string) => {
    const status = window.confirm("Are you sure you want to delete this news item?");
    if (!status) {
      return;
    }
    try {
      await deleteNews(id).unwrap();
      successToast("News deleted successfully!");

      // Remove the deleted news from the state
      setNews((prevNews) => prevNews.filter((item:any) => item._id !== id));
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

  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {news.map((item:any) => (
          <NewsCard
            handleDelete={() => handleDelete(item._id)}
            key={item._id}
            item={item}
          />
        ))}
      </div>

      {/* Show loading indicator when fetching more data */}
      {loading && <div>Loading more news...</div>}

      {/* Show message when no more data */}
      {!hasMore && <div className="text-center py-8">No more news to load.</div>}
    </div>
  );
}

export default AllNews;

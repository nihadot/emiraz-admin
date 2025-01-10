import { useDeleteBlogMutation, useGetBlogsQuery } from "@/features/blog/blogApi";
import BlogCard from "../../components/BlogCard/BlogCard";
import { useState, useEffect } from "react";
import { errorToast, successToast } from "@/components/Toast";
import { useLocation } from "react-router";

type Props = {};

interface BlogResponse {
  data: any[];
}

function AllBlogs({ }: Props) {
 
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<any[]>([]); // State to hold all blogs
  const [loading, setLoading] = useState(true); // Track loading state
  const [hasMore, setHasMore] = useState(true); // Track if there are more blogs to load
  const { state } = useLocation();
  const { data:blogData,  isLoading, refetch } = useGetBlogsQuery({ page, limit: 10 });
  const [deleteBlog] =
    useDeleteBlogMutation();
    const data = blogData as unknown as BlogResponse

   
  // Effect to fetch data when `data` is available or refetch is triggered
  useEffect(() => {   
    if (data) {
      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...data.data]); // Append new blogs
      }
      setLoading(false); // Stop loading when data is received
    }

    return ()=>{
      // setBlogs([]);
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
        setLoading(true); // Start loading more blogs
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
      setBlogs([]); // Reset blogs list
      setHasMore(true); // Ensure there's more data to load
      setLoading(true); // Start loading again
      refetch(); // Trigger refetch to reload blogs
    }
  }, [state, refetch]);

  const handleDelete = async (id: string) => {
    const status = window.confirm("Are you sure you want to delete this?");
    if (!status) {
      return;
    }
    try {
      await deleteBlog(id).unwrap();
      successToast("Blog deleted successfully!");

      // Remove the deleted blog from the state
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
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
            <div key={index} className="bg-slate-50 rounded-xl h-[468px] w-full"></div>
          ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return <div className="w-full h-screen justify-center items-center flex">No data available.</div>;
  }



  return (
    <div>
      <div className="grid grid-cols-3 gap-8">
        {blogs.map((blog:any) => (
          <BlogCard
            handleDelete={() => handleDelete(blog._id)}
            key={blog._id} // Ensure `id` exists in your Blog type
            item={blog}
          />
        ))}
      </div>

      {/* Show loading indicator when fetching more data */}
      {loading && <div>Loading more blogs...</div>}

      {/* Show message when no more data */}
      {!hasMore && <div className="text-center py-8">No more blogs to load.</div>}
    </div>
  );
}

export default AllBlogs;

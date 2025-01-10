import Paragraph from "@/components/Paragraph/Paragraph";
import { useGetContactsQuery } from "@/features/contact/contact";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function Contacts({}: Props) {


    const [page, setPage] = useState(1);
    const [contacts, setContacts] = useState([]); // State to hold all partners
    const [loading, setLoading] = useState(true); // Track loading state
    const [hasMore, setHasMore] = useState(true); // Track if there are more partners items to load
    const { state } = useLocation();
  


      const { data, isLoading, refetch } = useGetContactsQuery({ page, limit: 10 });
  
    
    
      useEffect(() => {
        if (data) {
          if (data.data.length === 0) {
            setHasMore(false);
          } else {
            setContacts((prev) => [...prev, ...data.data]); // Append new partners items
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
    
   
      // Effect to handle refetching when `state.refetch` changes
      useEffect(() => {
        if (state?.refetch) {
          setPage(1); // Reset page number to 1
          setContacts([]); // Reset news list
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
    
    
      if (contacts.length === 0) {
        return <div>No contacts available.</div>;
      }
    

  return (
    <div>
    <div className="grid grid-cols-3 gap-8">
      {contacts.map((item) => (
        <ContactsCard
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

export default Contacts



export interface IContacts {
    _id: string;
    firstName:string;
    lastName:string;
    message:string;
    phoneNumber:string;
}

type Props = {
    item: IContacts,
}

function ContactsCard({ item }: Props) {
    return (
    <div className='max-h-[300px] h-full border p-4 flex flex-col gap-4 w-full bg-transparent rounded-xl'>
   
    <Paragraph
        content={item?.firstName}
    />

<Paragraph
        content={item?.lastName}
    />
      <Paragraph
        content={item?.phoneNumber}
    />
      <Paragraph
        content={item?.message}
    />



</div>
  )
}
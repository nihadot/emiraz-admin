
"use client";

import {  logoutAuthAction } from "@/features/auth/authSlice";
import { Sidebar } from "flowbite-react";
import { Contact, GalleryHorizontalEnd, ListCheckIcon, LogOut, Newspaper, PartyPopperIcon } from "lucide-react";
import {  HiChartPie } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";

export default function Component() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = ()=>{
    const status = window.confirm('Are you want to logout ?')
    if(!status){
      return true;
    }
      dispatch(logoutAuthAction()); // Dispatch login action
      navigate('/'); // Redirect to login page if not authenticated


  }
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
         <Link to={'/dashboard'}>
         <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
         </Link>
          <Sidebar.Collapse icon={ListCheckIcon} label="Blogs">
            <Link to={'create-blog'}>
              <Sidebar.Item>Create Blog</Sidebar.Item>
            </Link>
            <Link to={'blogs'}>
              <Sidebar.Item>All Blogs</Sidebar.Item>
            </Link>
          </Sidebar.Collapse>


          <Sidebar.Collapse icon={Newspaper} label="News">
            <Link to={'create-news'}>
              <Sidebar.Item>Create News</Sidebar.Item>
            </Link>
            <Link to={'news'}>
              <Sidebar.Item>All News</Sidebar.Item>
            </Link>
          </Sidebar.Collapse>



          <Sidebar.Collapse icon={GalleryHorizontalEnd} label="Gallery">
            <Link to={'create-gallery'}>
              <Sidebar.Item>Create Galley</Sidebar.Item>
            </Link>
            <Link to={'gallery'}>
              <Sidebar.Item>All Galley</Sidebar.Item>
            </Link>
          </Sidebar.Collapse>




          <Sidebar.Collapse icon={PartyPopperIcon} label="Partners">
            <Link to={'create-partners'}>
              <Sidebar.Item>Create Partner</Sidebar.Item>
            </Link>
            <Link to={'partners'}>
              <Sidebar.Item>All Partners</Sidebar.Item>
            </Link>
          </Sidebar.Collapse>




          <Sidebar.Collapse icon={PartyPopperIcon} label="Products">
            <Link to={'create-products'}>
              <Sidebar.Item>Create Products</Sidebar.Item>
            </Link>
            <Link to={'products'}>
              <Sidebar.Item>All Products</Sidebar.Item>
            </Link>
          </Sidebar.Collapse>


<Link to={'/contacts'}>
          <Sidebar.Item  icon={Contact}>
            Contacts
          </Sidebar.Item>
</Link>



<div className="" onClick={handleLogout}>

          <Sidebar.Item  icon={LogOut}>
            Logout
          </Sidebar.Item>
</div>

       
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

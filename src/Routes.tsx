import { Routes as RootRouter, Route } from 'react-router';
import AdminLayout from './AdminLayout';
import CreateBlog from "./pages/Blogs/CreateBlog";
import AllBlogs from "./pages/Blogs/AllBlogs";
import Login from "./pages/Auth/Login";
import EditBlogBySlug from "./pages/Blogs/EditBlogBySlug";
import CreateNews from "./pages/News/CreateNews";
import AllNews from './pages/News/AllNews';
import EditNewsBySlug from "./pages/News/EditNewsBySlug";
import CreateGallery from './pages/Gallery/CreateGallery';
import AllGallery from "./pages/Gallery/AllGallery";
import EditGalleryBySlug from "./pages/Gallery/EditGalleryBySlug";
import CreatePartner from "./pages/Partners/CreatePartners";
import AllPartners from "./pages/Partners/AllPartners";
import EditPartnersBySlug from "./pages/Partners/EditPartnersBySlug"
import Dashboard from "./pages/Dashboard/Dashboard"
import CreateProducts from "./pages/Products/CreateProducts"
import AllProducts from './pages/Products/AllPartners';
import EditProductsBySlug from "./pages/Products/EditProductsBySlug"
import AllContacts from "./pages/Contact/Contacts"
type Props = {}

function Routes({ }: Props) {
  return (
    <RootRouter>

      <Route path='login' element={<Login />} />

      {/* Admin layout with nested routes */}
      <Route path="/" element={<AdminLayout />}>

      {/* dashboard */}
      <Route path='dashboard' element={<Dashboard />} />

        {/* blogs */}
        <Route path='create-blog' element={<CreateBlog />} />
        <Route path='blogs' element={<AllBlogs />} />
        <Route path='edit-blog/:slug' element={<EditBlogBySlug />} />

        {/* news */}
        <Route path='create-news' element={<CreateNews />} />
        <Route path='news' element={<AllNews />} />
        <Route path='edit-news/:slug' element={<EditNewsBySlug />} />
        {/*  */}



        {/* gallery */}
        <Route path='create-gallery' element={<CreateGallery />} />
        <Route path='gallery' element={<AllGallery />} />
        <Route path='edit-gallery/:slug' element={<EditGalleryBySlug />} />
        {/*  */}


        {/* partners */}
        <Route path='create-partners' element={<CreatePartner />} />
        <Route path='partners' element={<AllPartners />} />
        <Route path='edit-partners/:slug' element={<EditPartnersBySlug />} />
        {/*  */}


            {/* products */}
            <Route path='create-products' element={<CreateProducts />} />
        <Route path='products' element={<AllProducts />} />
        <Route path='edit-products/:slug' element={<EditProductsBySlug />} />
        {/*  */}


                {/* products */}
        <Route path='contacts' element={<AllContacts />} />
        {/*  */}



      </Route>
    </RootRouter>
  );
}

export default Routes;

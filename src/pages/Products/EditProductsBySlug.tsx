import { errorToast, successToast } from '@/components/Toast';
import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import * as Yup from "yup";
import DragDrop from '@/components/Uploader/DragDrop';
import Image from '@/components/Image/Image';
import Loader from '@/components/Loader/Loader';
import { CLOUDINARY_NAME, CLOUDINARY_PERSISTENT } from '@/api';
import axios from 'axios';
import { useGetAllProductsQuery, useGetProductQuery, useUpdateProductMutation } from '@/features/product/productsApi';

type Props = {}

// Validation schema using Yup
const validationSchema = Yup.object({
  productTitle: Yup.string()
    .trim()
    .required("Product title is required."),
  productTitleAr: Yup.string().required("عنوان المنتج مطلوب."), // Arabic validation (required only)
  productDescription: Yup.string()
    .trim()
    .required("Product description is required."),
  productDescriptionAr: Yup.string().required("وصف المنتج مطلوب."), // Arabic validation (required only)
  seoTitle: Yup.string()
    .required("SEO meta title is required."),
  seoTitleAr: Yup.string().required("عنوان السيو مطلوب."), // Arabic validation (required only)
  seoDescription: Yup.string()
    .required("SEO meta description is required."),
  seoDescriptionAr: Yup.string().required("وصف السيو مطلوب."), // Arabic validation (required only)
  seoKeywords: Yup.string()
    .trim()
    .required("SEO keywords are required."),
  seoKeywordsAr: Yup.string().required("كلمات مفتاحية للسيو مطلوبة."), // Arabic validation (required only)

     // New Fields
     productDetails: Yup.string().required("Name details are required."), // English validation

     productDetailsAr: Yup.string()
    .required("تفاصيل الاسم مطلوبة."), // Arabic validation
});

type ImageLink = {
  public_id: string;
  secure_url: string;
  url: string;
  bytes: number;
  width: number;
  height: number;
};

interface ProductFormValues {
    productTitle: string;
  productTitleAr: string;
  productDescription: string;
  productDescriptionAr: string;
  seoTitle: string;
  seoTitleAr: string;
  seoDescription: string;
  seoDescriptionAr: string;
  seoKeywords: string;
  seoKeywordsAr: string;
  imageLink?: ImageLink;
  productDetailsAr:string;
  productDetails:string;
}




function EditProductsBySlug({ }: Props) {
    const [shouldRefetch] = useState(false); // Control when to refetch

    const { state } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(state?.imageLink?.secure_url);
    const [imageFile, setImageFile] = useState<any>(null);
    const { data: blogData } = useGetProductQuery(slug, {
        skip: !!state, // Skip query if state exists
    });
    const [loading,setLoading] = useState(false);

    // Use RTK Query with the `skip` option
    const { } = useGetAllProductsQuery({}, { skip: !shouldRefetch })





    const [updateProduct, {  }] = useUpdateProductMutation();

    const [data, setData] = useState<ProductFormValues>(state);


    useEffect(() => {
        // If state is unavailable and API response is ready, assign it to local state
        if (!state && blogData) {
            setData(blogData?.data);
            //   setInitialImageState(blogData?.data?.imageLink);
            setPreview(blogData?.data?.imageLink?.secure_url || ''); // Set preview image
        }
    }, [state, blogData]);


    const formik = useFormik({
        initialValues: {
            productTitle: data?.productTitle || "",
            productTitleAr: data?.productTitleAr || "",
            productDescription: data?.productDescription || "",
            productDescriptionAr: data?.productDescriptionAr || "",
            seoTitle: data?.seoTitle || "",
            seoTitleAr: data?.seoTitleAr || "",
            seoDescription: data?.seoDescription || "",
            seoDescriptionAr: data?.seoDescriptionAr || "",
            seoKeywords: data?.seoKeywords || "",
            seoKeywordsAr: data?.seoKeywordsAr || "",
            imageLink: data?.imageLink?.secure_url || "",
            productDetails: data?.productDetails || "",
            productDetailsAr: data?.productDetailsAr || "",
        },
        //    },
        validationSchema,
        onSubmit: async (values, {  }) => {
          setLoading(true);
            try {

                

                const data: ProductFormValues = {
                    productTitle: values.productTitle,
                    productTitleAr: values.productTitleAr,
                    productDescription: values.productDescription,
                    productDescriptionAr: values.productDescriptionAr,
                    seoTitle: values.seoTitle,
                    seoTitleAr: values.seoTitleAr,
                    seoDescription: values.seoDescription,
                    seoDescriptionAr: values.seoDescriptionAr,
                    seoKeywords: values.seoKeywords,
                    seoKeywordsAr: values.seoKeywordsAr,
                    productDetails:values.productDetails,
                    productDetailsAr:values.productDetailsAr,
          
                  };

                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    formData.append("upload_preset", CLOUDINARY_PERSISTENT); // Replace with your actual preset
                    formData.append("folder", "city_images"); // Replace with your specific folder name
                    const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, formData);
                    const responseImageFile = {
                        public_id: response.data.public_id,
                        secure_url: response.data.secure_url,
                        url: response.data.url,
                        bytes: response.data.bytes,
                        width: response.data.width,
                        height: response.data.height,
                    }
                    data.imageLink = responseImageFile;
                }


                if (!slug) {
                  throw new Error("Product ID is missing");
                }

                await updateProduct({ id: slug, data }).unwrap();

                navigate('/products', { state: { refetch: true, id: slug } });

                successToast('Updated');


            } catch (err:any) {
                if (err?.data?.message) {
                    errorToast(err?.data?.message)
                } else if (Array.isArray(err?.data?.errors)) {
                    for (const item of err.data.errors) {
                        errorToast(item.msg)
                    }
                }


            }finally{
          setLoading(false);

            }

        },
        enableReinitialize: true,


    });


    const removeTheImage = () => {
        setPreview('');
        setImageFile('');
      }
    

    return (
        <form onSubmit={formik.handleSubmit} className="flex max-w-lg  flex-col gap-4">
        {/* Product Title (English) */}
       <div>
         <div className="mb-2 block">
           <Label htmlFor="productTitle" value="Product Title (English) *" />
         </div>
         <TextInput
           disabled={loading}
           id="productTitle"
           name="productTitle"
           placeholder="Enter product title"
           value={formik.values.productTitle}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />
         {formik.touched.productTitle && formik.errors.productTitle && (
           <p className="text-red-500 text-sm">{formik.errors.productTitle}</p>
         )}
       </div>
       
       {/* Product Title (Arabic) */}
       <div className="rtl">
         <div className="mb-2 block">
           <Label htmlFor="productTitleAr" value="عنوان المنتج (بالعربية) * " />
         </div>
         <TextInput
           disabled={loading}
           id="productTitleAr"
           name="productTitleAr"
           placeholder="أدخل عنوان المنتج"
           value={formik.values.productTitleAr}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />
         {formik.touched.productTitleAr && formik.errors.productTitleAr && (
           <p className="text-red-500 text-sm">{formik.errors.productTitleAr}</p>
         )}
       </div>
       
       {/* Product Description (English) */}
       <div>
         <div className="mb-2 block">
           <Label htmlFor="productDescription" value="Product Description (English) *" />
         </div>
         <Textarea
           className="h-80"
           disabled={loading}
           id="productDescription"
           name="productDescription"
           placeholder="Enter product description"
           value={formik.values.productDescription}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />
         {formik.touched.productDescription && formik.errors.productDescription && (
           <p className="text-red-500 text-sm">{formik.errors.productDescription}</p>
         )}
       </div>
       
       {/* Product Description (Arabic) */}
       <div className="rtl">
         <div className="mb-2 block">
           <Label htmlFor="productDescriptionAr" value="وصف المنتج (بالعربية) *" />
         </div>
         <Textarea
           id="productDescriptionAr"
           name="productDescriptionAr"
           disabled={loading}
           className="h-80"
           placeholder="أدخل وصف المنتج"
           value={formik.values.productDescriptionAr}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
         />
         {formik.touched.productDescriptionAr && formik.errors.productDescriptionAr && (
           <p className="text-red-500 text-sm">{formik.errors.productDescriptionAr}</p>
         )}
       </div>
           
             {/* SEO Meta Title (English) */}
             <div>
               <div className="mb-2 block">
                 <Label htmlFor="seoTitle" value="SEO Meta Title (English) *" />
               </div>
               <TextInput
                 disabled={loading}
                 id="seoTitle"
                 name="seoTitle"
                 placeholder="Enter SEO meta title"
                 value={formik.values.seoTitle}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoTitle && formik.errors.seoTitle && (
                 <p className="text-red-500 text-sm">{formik.errors.seoTitle}</p>
               )}
             </div>
       
             {/* SEO Meta Title (Arabic) */}
             <div className="rtl">
               <div className="mb-2 block">
                 <Label htmlFor="seoTitleAr" value="عنوان السيو (بالعربية) *" />
               </div>
               <TextInput
                 disabled={loading}
                 id="seoTitleAr"
                 name="seoTitleAr"
                 placeholder="أدخل عنوان السيو"
                 value={formik.values.seoTitleAr}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoTitleAr && formik.errors.seoTitleAr && (
                 <p className="text-red-500 text-sm">{formik.errors.seoTitleAr}</p>
               )}
             </div>
       
             {/* SEO Meta Description (English) */}
             <div>
               <div className="mb-2 block">
                 <Label htmlFor="seoDescription" value="SEO Meta Description (English) *" />
               </div>
               <Textarea
                 disabled={loading}
                 id="seoDescription"
                 name="seoDescription"
                 placeholder="Enter SEO meta description"
                 value={formik.values.seoDescription}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoDescription && formik.errors.seoDescription && (
                 <p className="text-red-500 text-sm">{formik.errors.seoDescription}</p>
               )}
             </div>
       
             {/* SEO Meta Description (Arabic) */}
             <div className="rtl">
               <div className="mb-2 block">
                 <Label htmlFor="seoDescriptionAr" value="وصف السيو (بالعربية) *" />
               </div>
               <Textarea
                 disabled={loading}
                 id="seoDescriptionAr"
                 name="seoDescriptionAr"
                 placeholder="أدخل وصف السيو"
                 value={formik.values.seoDescriptionAr}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoDescriptionAr && formik.errors.seoDescriptionAr && (
                 <p className="text-red-500 text-sm">{formik.errors.seoDescriptionAr}</p>
               )}
             </div>
       
             {/* SEO Keywords (English) */}
             <div>
               <div className="mb-2 block">
                 <Label htmlFor="seoKeywords" value="SEO Keywords (English) *" />
               </div>
               <TextInput
                 id="seoKeywords"
                 disabled={loading}
                 name="seoKeywords"
                 placeholder="Enter up to 3 keywords"
                 value={formik.values.seoKeywords}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoKeywords && formik.errors.seoKeywords && (
                 <p className="text-red-500 text-sm">{formik.errors.seoKeywords}</p>
               )}
             </div>
       
             {/* SEO Keywords (Arabic) */}
             <div className="rtl">
               <div className="mb-2 block">
                 <Label htmlFor="seoKeywordsAr" value="كلمات السيو (بالعربية) *" />
               </div>
               <TextInput
                 id="seoKeywordsAr"
                 disabled={loading}
                 name="seoKeywordsAr"
                 placeholder="أدخل كلمات السيو"
                 value={formik.values.seoKeywordsAr}
                 onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
               />
               {formik.touched.seoKeywordsAr && formik.errors.seoKeywordsAr && (
                 <p className="text-red-500 text-sm">{formik.errors.seoKeywordsAr}</p>
               )}
             </div>
       



{/* Product Description (English) */}
<div className="mb-4">
  <div className="mb-2 block">
    <Label htmlFor="productDescription" value="Product Description (English) *" />
  </div>
  <Textarea
    id="productDetails"
    name="productDetails"
    disabled={loading}
    className="h-80"
    placeholder="Enter product description"
    value={formik.values.productDetails}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.productDetails && formik.errors.productDetails && (
    <p className="text-red-500 text-sm">{formik.errors.productDetails}</p>
  )}
</div>

{/* Product Description (Arabic) */}
<div className="rtl">
  <div className="mb-2 block">
    <Label htmlFor="productDetailsAr" value="وصف المنتج (بالعربية) *" />
  </div>
  <Textarea
    id="productDetailsAr"
    name="productDetailsAr"
    disabled={loading}
    className="h-80"
    placeholder="أدخل وصف المنتج"
    value={formik.values.productDetailsAr}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  {formik.touched.productDetailsAr && formik.errors.productDetailsAr && (
    <p className="text-red-500 text-sm">{formik.errors.productDetailsAr}</p>
  )}
</div>


       
             {/* Image uploader (also checking size and compressing image to convert into webp) */}
             <div className="my-12">
               <DragDrop
                 onImageProcessed={(e:any) => {
                   setPreview(URL.createObjectURL(e))
                   setImageFile(e)
                 }}
               />
             </div>
       
             {preview ? <div className="">
               <Image
                 src={preview}
       
                 alt={formik.values.productTitle}
                 className="max-w-[360px] mb-3 rounded-xl h-[192px] object-cover w-full"
               />
               <label onClick={removeTheImage} htmlFor="" className="bg-red-600 p-2 rounded text-white text-xs">Remove</label>
             </div> : <div className="bg-slate-50 max-w-[360px] h-[192px] w-full rounded-xl "></div>}
       
       
       
             <div className="flex justify-center">
               <Button
               className="!bg-black  focus:bg-black !border-none !outline-none hover:!bg-black/80"
                 disabled={loading}
       
                 type="submit">{loading ? <><Loader width={20} height={20} /> <label htmlFor="" className="ms-3">loading...</label></> : 'Submit'}</Button>
             </div>
           </form>
    )
}

export default EditProductsBySlug
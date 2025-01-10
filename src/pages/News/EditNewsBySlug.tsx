import { CLOUDINARY_NAME, CLOUDINARY_PERSISTENT } from "@/api";
import Image from "@/components/Image/Image";
import Loader from "@/components/Loader/Loader";
import { errorToast, successToast } from "@/components/Toast";
import DragDrop from "@/components/Uploader/DragDrop";
import {    useGetNewsQuery, useUpdateNewsMutation } from "@/features/news/newsApi";
import axios from "axios";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import * as Yup from "yup";

type Props = {}


interface NewsFormValues {
    newsTitle: string;
    newsTitleAr: string;
    newsDescription: string;
    newsDescriptionAr: string;
    newsDate: string;
    seoTitle: string;
    seoTitleAr: string;
    seoDescription: string;
    seoDescriptionAr: string;
    seoKeywords: string;
    seoKeywordsAr: string;
    imageLink: string;
}

const validationSchema = Yup.object({
    newsTitle: Yup.string()
        .trim()
       
        .required("News title is required."),
    newsTitleAr: Yup.string().required("عنوان الخبر مطلوب."), // Arabic validation (required only)
    newsDescription: Yup.string()
        .trim()
        .required("News description is required."),
    newsDescriptionAr: Yup.string().required("وصف الخبر مطلوب."), // Arabic validation (required only)
    newsDate: Yup.date()
        .nullable()
        .min(new Date(), "Past dates are not allowed.")
        .required("Date is required."),
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
});

function EditNewsBySlug({}: Props) {

    const { state } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(state?.imageLink?.secure_url);
    const [imageFile, setImageFile] = useState(null);
    const [loading,setLoading] = useState(false);
  

        const { data: newsData } = useGetNewsQuery(slug, {
            skip: !!state, // Skip query if state exists
          });

    const [updateNew, {  }] = useUpdateNewsMutation();
 

        const [data, setData] = useState<NewsFormValues>(state);
    

       
           useEffect(() => {
               // If state is unavailable and API response is ready, assign it to local state
               if (!state && newsData) {
                   setData(newsData?.data);
                   //   setInitialImageState(newsData?.data?.imageLink);
                   setPreview(newsData?.data?.imageLink?.secure_url || ''); // Set preview image
               }
           }, [state, newsData]);
        

         // Validation schema using Yup
          const formik = useFormik({
              initialValues: {
                newsTitle: data?.newsTitle,
                newsTitleAr: data?.newsTitleAr || "",
                newsDescription: data?.newsDescription || "",
                newsDescriptionAr: data?.newsDescriptionAr || "",
                newsDate:data?.newsDate && (new Date(data?.newsDate).toISOString().split("T")[0]) || "",
                seoTitle: data?.seoTitle || "",
                seoTitleAr: data?.seoTitleAr || "",
                seoDescription: data?.seoDescription || "",
                seoDescriptionAr: data?.seoDescriptionAr || "",
                seoKeywords: data?.seoKeywords || "",
                seoKeywordsAr: data?.seoKeywordsAr || "",
                imageLink: data?.imageLink?.secure_url || "",
              },
              // Uncomment for testing with default values
            
              validationSchema,
              onSubmit: async (values, { resetForm }) => {
                  try {
                 
                      const formdata: NewsFormValues = {
                          newsTitle: values.newsTitle,
                          newsTitleAr: values.newsTitleAr,
                          newsDescription: values.newsDescription,
                          newsDescriptionAr: values.newsDescriptionAr,
                          newsDate: values.newsDate,
                          seoTitle: values.seoTitle,
                          seoTitleAr: values.seoTitleAr,
                          seoDescription: values.seoDescription,
                          seoDescriptionAr: values.seoDescriptionAr,
                          seoKeywords: values.seoKeywords,
                          seoKeywordsAr: values.seoKeywordsAr,
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
                        formdata.imageLink = responseImageFile;
                    }
    
      
                      await updateNew({id:slug,data:formdata}).unwrap();
      
                     
                navigate('/news', { state: { refetch: true, id: slug } });


                      successToast('Updated');
      
                  } catch (err) {
                    
                      if (err?.message ||err?.data?.message) {
                          errorToast(err?.message || err?.data?.message);
                      } else if (Array.isArray(err?.data?.errors)) {
                          for (const item of err.data.errors) {
                              errorToast(item.msg);
                          }
                      }
                  }
              },
        enableReinitialize: true,

          });

  return (
    <form onSubmit={formik.handleSubmit} className="flex max-w-lg flex-col gap-4">
    {/* News Title (English) */}
    <div>
        <div className="mb-2 block">
            <Label htmlFor="newsTitle" value="News Title (English) *" />
        </div>
        <TextInput
            disabled={loading}
            id="newsTitle"
            name="newsTitle"
            placeholder="Enter news title"
            value={formik.values.newsTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.newsTitle && formik.errors.newsTitle && (
            <p className="text-red-500 text-sm">{formik.errors.newsTitle}</p>
        )}
    </div>

    {/* News Title (Arabic) */}
    <div className="rtl">
        <div className="mb-2 block">
            <Label htmlFor="newsTitleAr" value="عنوان الخبر (بالعربية) * " />
        </div>
        <TextInput
            disabled={loading}
            id="newsTitleAr"
            name="newsTitleAr"
            placeholder="أدخل عنوان الخبر"
            value={formik.values.newsTitleAr}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.newsTitleAr && formik.errors.newsTitleAr && (
            <p className="text-red-500 text-sm">{formik.errors.newsTitleAr}</p>
        )}
    </div>

    {/* News Description (English) */}
    <div>
        <div className="mb-2 block">
            <Label htmlFor="newsDescription" value="News Description (English) *" />
        </div>
        <Textarea
            className="h-80"
            disabled={loading}
            id="newsDescription"
            name="newsDescription"
            placeholder="Enter news description"
            value={formik.values.newsDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.newsDescription && formik.errors.newsDescription && (
            <p className="text-red-500 text-sm">{formik.errors.newsDescription}</p>
        )}
    </div>

    {/* News Description (Arabic) */}
    <div className="rtl">
        <div className="mb-2 block">
            <Label htmlFor="newsDescriptionAr" value="وصف الخبر (بالعربية) *" />
        </div>
        <Textarea
            className="h-80"

            id="newsDescriptionAr"
            name="newsDescriptionAr"
            disabled={loading}
            placeholder="أدخل وصف الخبر"
            value={formik.values.newsDescriptionAr}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.newsDescriptionAr && formik.errors.newsDescriptionAr && (
            <p className="text-red-500 text-sm">{formik.errors.newsDescriptionAr}</p>
        )}
    </div>

    {/* News Date */}
    <div>
        <div className="mb-2 block">
            <Label htmlFor="newsDate" value="News Date *" />
        </div>
        <TextInput
            type="date"
            id="newsDate"
            disabled={loading}
            name="newsDate"
            value={formik.values.newsDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min={new Date().toISOString().split("T")[0]} // Disallow past dates
        />
        {formik.touched.newsDate && formik.errors.newsDate && (
            <p className="text-red-500 text-sm">{formik.errors.newsDate}</p>
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

    {/* Image uploader (also checking size and compressing image to convert into webp) */}
    <div className="my-12">
        <DragDrop
            onImageProcessed={(e) => {
                setPreview(URL.createObjectURL(e))
                setImageFile(e)
            }}
        />
    </div>

    {preview ? <div className="">
                <Image
                    src={preview}
                    alt={formik.values.newsTitle}
                    className="max-w-[360px] mb-3 rounded-xl h-[192px] object-cover w-full"
                />
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

export default EditNewsBySlug
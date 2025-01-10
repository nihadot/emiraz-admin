import { errorToast, successToast } from '@/components/Toast';
import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import * as Yup from "yup";
import DragDrop from '@/components/Uploader/DragDrop';
import Image from '@/components/Image/Image';
import { useGetBlogQuery, useGetBlogsQuery, useUpdateBlogMutation } from '@/features/blog/blogApi';
import Loader from '@/components/Loader/Loader';
import { CLOUDINARY_NAME, CLOUDINARY_PERSISTENT } from '@/api';
import axios from 'axios';

type Props = {}

// Validation schema using Yup
const validationSchema = Yup.object({
    blogTitle: Yup.string()
        .trim()
        .required("Blog title is required."),
    blogTitleAr: Yup.string().required("عنوان المدونة مطلوب."), // Arabic validation (required only)
    blogDescription: Yup.string()
        .trim()
        .required("Blog description is required."),
    blogDescriptionAr: Yup.string().required("وصف المدونة مطلوب."), // Arabic validation (required only)
    blogDate: Yup.date()
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

interface BlogFormValues {
    blogTitle: string;
    blogTitleAr: string;
    blogDescription: string;
    blogDescriptionAr: string;
    blogDate: string;
    seoTitle: string;
    seoTitleAr: string;
    seoDescription: string;
    seoDescriptionAr: string;
    seoKeywords: string;
    seoKeywordsAr: string;
    imageLink: string;
}




function EditBlogBySlug({ }: Props) {
    const [shouldRefetch] = useState(false); // Control when to refetch

    const { state } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(state?.imageLink?.secure_url);
    const [imageFile, setImageFile] = useState(null);
    const { data: blogData } = useGetBlogQuery(slug, {
        skip: !!state, // Skip query if state exists
    });
    const [loading,setLoading] = useState(false);

    // Use RTK Query with the `skip` option
    const { } = useGetBlogsQuery({}, { skip: !shouldRefetch })





    const [updateBlog, {  }] = useUpdateBlogMutation();

    const [data, setData] = useState<BlogFormValues>(state);


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
            blogTitle: data?.blogTitle,
            blogTitleAr: data?.blogTitleAr || "",
            blogDescription: data?.blogDescription || "",
            blogDescriptionAr: data?.blogDescriptionAr || "",
            blogDate: data?.blogDate && (new Date(data?.blogDate).toISOString().split("T")[0]) || "",
            seoTitle: data?.seoTitle || "",
            seoTitleAr: data?.seoTitleAr || "",
            seoDescription: data?.seoDescription || "",
            seoDescriptionAr: data?.seoDescriptionAr || "",
            seoKeywords: data?.seoKeywords || "",
            seoKeywordsAr: data?.seoKeywordsAr || "",
            imageLink: data?.imageLink?.secure_url || "",
        },
        //    },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
          setLoading(true);
            try {

                

                const data: BlogFormValues = {
                    blogTitle: values.blogTitle,
                    blogTitleAr: values.blogTitleAr,
                    blogDescription: values.blogDescription,
                    blogDescriptionAr: values.blogDescriptionAr,
                    blogDate: values.blogDate,
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
                    data.imageLink = responseImageFile;
                }



                await updateBlog({ id: slug, data }).unwrap();

                navigate('/blogs', { state: { refetch: true, id: slug } });

                successToast('Updated');


            } catch (err) {
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


    return (
        <form onSubmit={formik.handleSubmit} className="flex max-w-lg flex-col gap-4">
            {/* Blog Title (English) */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="blogTitle" value="Blog Title (English) *" />
                </div>
                <TextInput
                    disabled={loading}
                    id="blogTitle"
                    name="blogTitle"
                    placeholder="Enter blog title"
                    value={formik.values.blogTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.blogTitle && formik.errors.blogTitle && (
                    <p className="text-red-500 text-sm">{formik.errors.blogTitle}</p>
                )}
            </div>

            {/* Blog Title (Arabic) */}
            <div className="rtl">
                <div className="mb-2 block">
                    <Label htmlFor="blogTitleAr" value="عنوان المدونة (بالعربية) * " />
                </div>
                <TextInput
                    disabled={loading}
                    id="blogTitleAr"
                    name="blogTitleAr"
                    placeholder="أدخل عنوان المدونة"
                    value={formik.values.blogTitleAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.blogTitleAr && formik.errors.blogTitleAr && (
                    <p className="text-red-500 text-sm">{formik.errors.blogTitleAr}</p>
                )}
            </div>

            {/* Blog Description (English) */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="blogDescription" value="Blog Description (English) *" />
                </div>
                <Textarea
                    disabled={loading}
                    className="h-80"
                    id="blogDescription"
                    name="blogDescription"
                    placeholder="Enter blog description"
                    value={formik.values.blogDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.blogDescription && formik.errors.blogDescription && (
                    <p className="text-red-500 text-sm">{formik.errors.blogDescription}</p>
                )}
            </div>

            {/* Blog Description (Arabic) */}
            <div className="rtl">
                <div className="mb-2 block">
                    <Label htmlFor="blogDescriptionAr" value="وصف المدونة (بالعربية) *" />
                </div>
                <Textarea
                    className="h-80"

                    disabled={loading}
                    id="blogDescriptionAr"
                    name="blogDescriptionAr"
                    placeholder="أدخل وصف المدونة"
                    value={formik.values.blogDescriptionAr}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.blogDescriptionAr && formik.errors.blogDescriptionAr && (
                    <p className="text-red-500 text-sm">{formik.errors.blogDescriptionAr}</p>
                )}
            </div>

            {/* Blog Date */}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="blogDate" value="Blog Date *" />
                </div>
                <TextInput
                    disabled={loading}
                    type="date"
                    id="blogDate"
                    name="blogDate"
                    value={formik.values.blogDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={new Date().toISOString().split("T")[0]} // Disallow past dates
                />
                {formik.touched.blogDate && formik.errors.blogDate && (
                    <p className="text-red-500 text-sm">{formik.errors.blogDate}</p>
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
                    disabled={loading}
                    id="seoKeywords"
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
                    disabled={loading}
                    id="seoKeywordsAr"
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
                    alt={formik.values.blogTitle}
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

export default EditBlogBySlug
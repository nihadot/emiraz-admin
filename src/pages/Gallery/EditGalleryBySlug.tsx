import { CLOUDINARY_NAME, CLOUDINARY_PERSISTENT } from "@/api";
import Image from "@/components/Image/Image";
import Loader from "@/components/Loader/Loader";
import { errorToast, successToast } from "@/components/Toast";
import DragDrop from "@/components/Uploader/DragDrop";
import { useGetAllGalleryQuery, useGetGalleryQuery, useUpdateGalleryMutation } from "@/features/gallery/galleryApi";
import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { ImageLink } from "../Partners/CreatePartners";

type Props = {}

interface GalleryValues {
    name: string;
    imageLink?: ImageLink;
}


const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Gallery title is required."),
});


function EditGalleryBySlug({}: Props) {


    const [shouldRefetch] = useState(false); // Control when to refetch
    const [loading,setLoading] = useState(false); // Control when to refetch

    const { state } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [preview, setPreview] = useState(state?.imageLink?.secure_url);
      const [imageFile, setImageFile] = useState<any>(null);
      const { data: galleryData } = useGetAllGalleryQuery(slug, {
          skip: !!state, // Skip query if state exists
      });
      const [data, setData] = useState<GalleryValues>(state);

          // Use RTK Query with the `skip` option
          const { } = useGetGalleryQuery({}, { skip: !shouldRefetch })
      
              const [updateGallery, {  }] = useUpdateGalleryMutation();
          

                  useEffect(() => {
                      // If state is unavailable and API response is ready, assign it to local state
                      if (!state && galleryData) {
                          setData(galleryData?.data);
                          //   setInitialImageState(galleryData?.data?.imageLink);
                          setPreview(galleryData?.data?.imageLink?.secure_url || ''); // Set preview image
                      }
                  }, [state, galleryData]);
              

    // Validation schema using Yup
    const formik = useFormik({
        initialValues: {
            name: data?.name || "",
        },
        // Uncomment for testing with default values
      
        validationSchema,
        onSubmit: async (values, {  }) => {
           setLoading(true);
            try {
            
                const data: GalleryValues = {
                    name: values.name
                };


                if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    formData.append("upload_preset", CLOUDINARY_PERSISTENT); // Replace with your actual preset
                    formData.append("folder", "news_images"); // Replace with your specific folder name
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
                        formData
                    );
                    const responseImageFile = {
                        public_id: response.data.public_id,
                        secure_url: response.data.secure_url,
                        url: response.data.url,
                        bytes: response.data.bytes,
                        width: response.data.width,
                        height: response.data.height,
                    };
                    data.imageLink = responseImageFile;
                }
                if (!slug) {
                    throw new Error("Product ID is missing");
                  }
  

                 await updateGallery({ id:slug,data:data}).unwrap();

                 navigate('/gallery', { state: { refetch: true, id: slug } });

                 successToast('Updated');

            }catch (err:any) {
                if (err?.message || err?.data?.message) {
                    errorToast(err?.data?.message || err.message);
                } else if (Array.isArray(err?.data?.errors)) {
                    for (const item of err.data.errors) {
                        errorToast(item.msg);
                    }
                }
            }finally{
                setLoading(false);
            }
        },
    });

  return (
    <form onSubmit={formik.handleSubmit} className="flex max-w-lg flex-col gap-4">
    {/* Name  */}
    <div>
        <div className="mb-2 block">
            <Label htmlFor="Name" value="Name" />
        </div>
        <TextInput
            disabled={loading}
            id="name"
            name="name"
            placeholder="Enter name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
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
            alt={formik.values.name}
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

export default EditGalleryBySlug
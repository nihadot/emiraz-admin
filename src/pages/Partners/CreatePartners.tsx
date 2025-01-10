import { CLOUDINARY_NAME, CLOUDINARY_PERSISTENT } from '@/api';
import Image from '@/components/Image/Image';
import Loader from '@/components/Loader/Loader';
import { errorToast, successToast } from '@/components/Toast';
import DragDrop from '@/components/Uploader/DragDrop';
import { useAddPartnersMutation } from '@/features/partners/partnersApi';
import axios from 'axios';
import { Button, Label, TextInput } from 'flowbite-react';
import { useFormik } from 'formik';
import { useState } from 'react'
import * as Yup from "yup";

type Props = {}

export type ImageLink = {
    public_id: string;
    secure_url: string;
    url: string;
    bytes: number;
    width: number;
    height: number;
};
interface GalleryValues {
    name: string;
    imageLink?: ImageLink;
}



const validationSchema = Yup.object({
    name: Yup.string()
        .trim()
        .matches(/^[a-zA-Z@!# ]+$/, "Only letters, @, !, #, and spaces are allowed.")
        .min(3, "Name title must be at least 3 characters.")
        .max(40, "Name title cannot exceed 40 characters.")
        .required("Name title is required."),
});

function CreatePartners({ }: Props) {
    const [addPartners, {  }] = useAddPartnersMutation();
    const [preview, setPreview] = useState<any>();
    const [imageFile, setImageFile] = useState<any>();
    const [loading,setLoading] = useState(false);


    // Validation schema using Yup
    const formik = useFormik({
        // initialValues: {
        //     name: "",
        // },
        // Uncomment for testing with default values
        initialValues: {
            name: "Example", // English news title
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setLoading(true);
            try {
                if (!imageFile) {
                    return errorToast("Image is required");
                }

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

                const response = await addPartners(data).unwrap();

                successToast(response.message || "Created");

                resetForm(); // Clear the form after submission
                setPreview('');
                setImageFile('');
            } catch (err:any) {
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

    const removeTheImage = () => {
        setPreview('');
        setImageFile('');
    }

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

export default CreatePartners
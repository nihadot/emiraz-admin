import React from 'react'
import Image from '../Image/Image'
import HeadingThree from '../Titles/MainHeading/HeaderThree'
import Paragraph from '../Paragraph/Paragraph'
import { IconButton } from '../Buttons'
import { rightArrow } from '../../assets/assets/svg'
import { useNavigate } from 'react-router'

export interface Products {
    _id: string;
    productTitle:string;
    imageLink: {
        public_id: string;
        secure_url: string;
        url: string;
        bytes: number;
        width: number;
        height: number;
    };
    updatedAt: string; // ISO date string
    __v: number;
    slugNameEn:string;
}


type Props = {
    item: Products,
    handleDelete: (id: string) => void; // Function that takes a blog ID as an argument
}

function ProductsCard({ item, handleDelete }: Props) {
    const  navigate = useNavigate();
    return (
        <div className='h-[300px] border p-4 flex flex-col gap-4 w-full bg-transparent rounded-xl'>
            <Image
                lazyLoad
                placeholder='https://placehold.co/300x468'
                alt=''
                src={item?.imageLink?.secure_url}
                className='w-full h-[192px] bg-slate-100 rounded-xl'
            />
     
            <Paragraph
                content={item?.productTitle}
            />

            <div className="flex w-full gap-4">
                <IconButton
                    handleClick={()=>navigate(`/edit-products/${item?.slugNameEn}`,{state:item})}

                    containerClassName='border-none text-white bg-green-600 flex-1 p-4 rounded h-[30px]'
                    content='Edit'
                />
               
                    <IconButton
                    handleClick={handleDelete}
                        containerClassName='border-none bg-red-600 text-white flex-1 p-4 rounded h-[30px]'
                        content='Delete'
                    />
                
            </div>

        </div>
    )
}

export default ProductsCard
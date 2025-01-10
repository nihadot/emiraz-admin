import Image from '../Image/Image'
import HeadingThree from '../Titles/MainHeading/HeaderThree'
import Paragraph from '../Paragraph/Paragraph'
import { IconButton } from '../Buttons'
import { useNavigate } from 'react-router'

export interface News {
    _id: string;
    newsDate: string; // ISO date string
    newsTitle: string;
    newsTitleAr: string;
    newsDescription: string;
    newsDescriptionAr: string;
    imageLink: {
        public_id: string;
        secure_url: string;
        url: string;
        bytes: number;
        width: number;
        height: number;
    };
    seoTitle: string;
    seoTitleAr: string;
    seoDescription: string;
    seoDescriptionAr: string;
    seoKeywords: string;
    seoKeywordsAr: string;
    slugNameEn: string;
    slugNameAr: string;
    updatedAt: string; // ISO date string
    __v: number;
}

type Props = {
    item: News,
    handleDelete: (id: string) => void; // Function that takes a news ID as an argument
}

function NewsCard({ item, handleDelete }: Props) {
    const  navigate = useNavigate();

    return (
        <div className='h-[468px] border p-4 flex flex-col gap-4 w-full bg-transparent rounded-xl'>
            <Image
                lazyLoad
                placeholder='https://placehold.co/300x468'
                alt=''
                src={item?.imageLink?.secure_url}
                className='w-full h-[192px] bg-slate-100 rounded-xl'
            />
            <HeadingThree
                content={item?.newsTitle}
            />

            <Paragraph
                content={item?.newsDescription}
            />

            <div className="flex w-full gap-4">
                <IconButton
                    handleClick={()=>navigate(`/edit-news/${item?.slugNameEn}`,{state:item})}
                    containerClassName='border-none text-white bg-green-600 flex-1 p-4 rounded h-[30px]'
                    content='Edit'
                />
               
                <IconButton
                    handleClick={() => handleDelete(item?._id)}
                    containerClassName='border-none bg-red-600 text-white flex-1 p-4 rounded h-[30px]'
                    content='Delete'
                />
            </div>
        </div>
    )
}

export default NewsCard

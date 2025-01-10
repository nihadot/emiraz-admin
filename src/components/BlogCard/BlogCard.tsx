import Image from '../Image/Image'
import HeadingThree from '../Titles/MainHeading/HeaderThree'
import Paragraph from '../Paragraph/Paragraph'
import { IconButton } from '../Buttons'
import { useNavigate } from 'react-router'

export interface Blog {
    _id: string;
    blogDate: string; // ISO date string
    blogTitle: string;
    blogTitleAr: string;
    blogDescription: string;
    blogDescriptionAr: string;
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
    item: Blog,
    handleDelete: (id: string) => void; // Function that takes a blog ID as an argument
}

function BlogCard({ item, handleDelete }: Props) {
    const  navigate = useNavigate();
    return (
        <div className='h-[468px] border p-4 flex flex-col gap-4 w-full bg-transparent rounded-xl'>
            <Image
                lazyLoad
                placeholder='https://placehold.co/300x468'
                alt=''
                src={item.imageLink.secure_url}
                className='w-full h-[192px] bg-slate-100 rounded-xl'
            />
            <HeadingThree

                content={item.blogTitle}
            />

            <Paragraph
                content={item.blogDescription}
            />

            <div className="flex w-full gap-4">
                <IconButton
                    handleClick={()=>navigate(`/edit-blog/${item.slugNameEn}`,{state:item})}

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

export default BlogCard
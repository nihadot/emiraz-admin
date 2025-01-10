import { useGetAllGalleryQuery } from '@/features/gallery/galleryApi'
import { User } from 'lucide-react'

type Props = {}

function Dashboard({ }: Props) {

    const { data } = useGetAllGalleryQuery({ page: 1, limit: 10 });


    return (
        <div className='w-full py-4 grid grid-cols-4 gap-4'>

            <Cards
                count={data?.pagination?.totalCount?.countOfBlogs}
                title={'Blogs'}
            />

            <Cards
                count={data?.pagination?.totalCount?.countOfGallery}
                title={'Gallery'}
            />

            <Cards
                count={data?.pagination?.totalCount?.countOfNews}
                title={'News'}
            />

            <Cards
                count={data?.pagination?.totalCount?.countOfPartners}
                title={'Partners'}
            />




        </div>
    )
}

export default Dashboard



function Cards({ title, count }: {
    title: any;
    count: any;
}) {
    return (
        <div className='w-full bg-slate-100 flex justify-between items-center rounded-lg p-4'>

            <div className="">

                <div className="text-lg font-medium capitalize">{title}</div>

                <div className='text-black/80 font-semibold text-2xl'>{count}</div>

            </div>
            <div className="">
                <User size={30} />
            </div>
        </div>
    )
}

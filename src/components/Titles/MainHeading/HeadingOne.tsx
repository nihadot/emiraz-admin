
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function HeadingOne({className,id,content}: Props) {
  return (
   <h1 className={`max-w-[600px] text-3xl leading-tight font-semibold md:font-bold font-poppins w-full md:text-5xl text-white ${className}`} id={id}  >{content}</h1>
  )
}

export default HeadingOne
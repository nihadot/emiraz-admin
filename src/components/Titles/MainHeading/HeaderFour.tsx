
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function HeaderFour({className,id,content}: Props) {
  return (
   <h4 className={`max-w-[600px] leading-tight text-2xl w-full sm:text-4xl font-semibold text-white md:font-bold font-poppins ${className}`} id={id}  >{content}</h4>
  )
}

export default HeaderFour
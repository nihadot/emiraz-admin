
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function HeaderFive({className,id,content}: Props) {
  return (
   <h5 className={` leading-tight  text-xl text-white font-semibold font-poppins ${className}`} id={id}  >{content}</h5>
  )
}

export default HeaderFive
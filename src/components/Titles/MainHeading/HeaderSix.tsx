
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function HeaderSix({className,id,content}: Props) {
  return (
   <h6 className={` leading-loose  text-base text-white/60 font-light font-poppins ${className}`} id={id}  >{content}</h6>
  )
}

export default HeaderSix
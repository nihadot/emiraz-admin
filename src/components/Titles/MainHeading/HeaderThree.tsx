
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function HeadingThree({className,id,content}: Props) {
  return (
   <h3 className={`w-full bg-transparent text-2xl line-clamp-2 text-ellipsis ${className}`} id={id}  >{content}</h3>
  )
}

export default HeadingThree
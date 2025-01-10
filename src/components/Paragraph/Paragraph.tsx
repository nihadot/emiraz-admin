
type Props = {
    id?:string,
    className?:string,
    content:string,
}

function Paragraph({className,id,content}: Props) {
  return (
   <p className={`w-full bg-transparent line-clamp-4 text-ellipsis ${className} `} id={id}  >{content}</p>
  )
}

export default Paragraph
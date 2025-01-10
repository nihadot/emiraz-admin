import Image from '../Image/Image'

type Props = {
    content:string;
    imageClassName?:string;
    iconUrl?:string;
    containerClassName?:string;
    labelClassName?:string;
    handleClick:any;
}

function IconBtn({content,iconUrl, imageClassName,containerClassName,labelClassName,handleClick}: Props) {
  return (
    <button onClick={handleClick} className={`text-black flex items-center gap-3 ${containerClassName}`}>
       { iconUrl &&  <Image
       alt=''
        className={`w-8 h-8 object-cover ${imageClassName}`}
        src={iconUrl}
        />}
        <label className={`text-sm font-medium font-sfbold ${labelClassName}`}>{content}</label>
    </button>
  )
}

export default IconBtn
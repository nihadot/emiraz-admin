import { TailSpin } from 'react-loader-spinner'


function Loader({height = 80,width =80,}: {height:number | string, width:number | string}) {
  return (
    <TailSpin
  visible={true}
  height={height}
  width={width}
  color="#fff"
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  />
  )
}

export default Loader
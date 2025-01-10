import Routes from "./Routes"
import { Toaster } from 'react-hot-toast';
 
const App = () => {

  return (
    <div className="w-full max-w-[1440px] m-auto" >
      <Routes />
      <Toaster />
    </div>
  )
}

export default App
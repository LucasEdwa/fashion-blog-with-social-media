import { Routes, Route} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'


function App() {

  return (
    <>
   <Navbar />
   <Footer />
     <Routes>
        <Route path="/" element={<h1 className='text-red-700 text-center p-4'>Home</h1>} />
        <Route path="/timeline" element={<h1 className='text-center'>Timeline</h1>} />
        <Route path="/seasons" element={<h1>Seasons</h1>} />
        <Route path="/seasons/:seasonId" element={<h1>Season Details</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/profile/:userId" element={<h1>User Profile</h1>} />
      </Routes>

    </>
  )
}

export default App

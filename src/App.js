import React, {useState} from 'react'
import { ToastContainer } from 'react-toastify'
import { Route,BrowserRouter,Routes } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Pages/Home'
import Detail from './components/Pages/Detail'
import Grafik from './components/Pages/Grafik'
import Report from './components/Pages/Report'
import Sidebar from './components/Header/Sidebar'

import './index.css'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isopen, setisopen] = useState(false);
  const toggle = () => {
    setisopen(!isopen)
  }

  // const { notifications, clear, markAllAsRead, markAsRead } = useNotificationCenter()
   return (
    <BrowserRouter>
      <Header toggle={toggle} />
      <Sidebar isOpen={isopen} toggle={toggle} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:sensorId" element={<Detail />} />
        <Route path="/grafik" element={<Grafik/>} />
        <Route path="/catatan" element={<Report />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter> 
  )
}

export default App
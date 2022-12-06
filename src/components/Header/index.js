import React, {useState, useEffect} from "react"

import { Link } from "react-router-dom"

import { FaBars } from "react-icons/fa"
import { TbHeartRateMonitor } from 'react-icons/tb'
import { RiHomeLine, RiBarChartBoxLine, RiHistoryLine } from 'react-icons/ri'


import "./styles.css"

const Header = ({ toggle }) => {
  const [jam, setJam] = useState('')
  useEffect(() => {
    const interval = setInterval(() => {
      setJam(new Date().toLocaleTimeString())
    }, 1000)
    return (() => {
      clearInterval(interval)
    })
  }, [])

  return (
    <nav>
      <h2><Link to="/" className="link"><TbHeartRateMonitor size={36} />Monitor ruangan</Link></h2>
      <div className="menu-items">
        <h3>
          <Link to='/' className="link">
            <RiHomeLine size={18} />-Menu utama
          </Link>
        </h3>
        <h3>
          <Link to='/grafik' className="link">
            <RiBarChartBoxLine />-Grafik batang
          </Link>
        </h3>
        <h3>
          <Link to='/catatan' className="link">
            <RiHistoryLine />-Catatan
          </Link>
        </h3>
      </div>
      <div className="icons">
        <div  className="clock-container">
          <h3  color="#2D2424">{jam}</h3>
        </div>
        <div className="mobile-menu-icon">
          <FaBars size={22} onClick={toggle} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
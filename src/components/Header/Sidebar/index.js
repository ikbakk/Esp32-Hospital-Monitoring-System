import React from "react"
import { Link } from "react-router-dom"

import { RiHomeLine, RiBarChartBoxLine, RiHistoryLine } from 'react-icons/ri'
import { FaTimes } from "react-icons/fa"

import "./styles.css"

const Sidebar = ({ isOpen, toggle }) => {
  let opacityClasses = ["sidebar-container"];
  if (isOpen) {
    opacityClasses.push("opacity-on");
  } else {
    opacityClasses.push("opacity-off");
  }

  return (
    <div
      className={opacityClasses.join(" ")}
      isopen={isOpen.toString()}
      onClick={toggle}
    >
      <div className="icon">
        <FaTimes className="close-icon" onClick={toggle} />
      </div>
      <div className="sidebar-wrapper">
        <div className="sidebar-menu">
        <h3>
          <Link to='/' className="sidebar-links">
            <RiHomeLine size={18} />-Menu utama
          </Link>
        </h3>
        <h3>
          <Link to='/grafik' className="sidebar-links">
            <RiBarChartBoxLine />-Grafik batang
          </Link>
        </h3>
        <h3>
          <Link to='/catatan' className="sidebar-links">
            <RiHistoryLine />-Catatan
          </Link>
        </h3>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
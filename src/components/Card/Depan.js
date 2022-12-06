import React from 'react'

import { FaHeartbeat } from 'react-icons/fa'
import { GiLungs } from 'react-icons/gi'
import { WiThermometer } from 'react-icons/wi'

import './styles.css'

const Depan = ({beat, spo2, temp}) => {
  return (
    <div className="content-depan">
      <div className="sensor-info">
        <FaHeartbeat size={28} />
        <p>{beat} bpm</p>
      </div>
      <div className="sensor-info">
        <GiLungs size={28} />
        <p>{spo2} %</p>
      </div>
      <div className="sensor-info">
        <WiThermometer size={28} />
        <p>{temp} ºC</p>
      </div>
    </div>
  )
}

export default Depan
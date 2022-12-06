import React from 'react'
import _ from 'lodash'

import { FaHeartbeat } from 'react-icons/fa'
import { GiLungs } from 'react-icons/gi'
import { WiThermometer } from 'react-icons/wi'

import './styles.css'

const Belakang = ({beat, spo2, temp}) => {
  
  const statistikData = (data) => {
    if ( beat === ' ') {
      return {maxData: '--', meanData: '--', minData: '--'}
    }
    const maxData = _.max(data)
    const minData = _.min(data)
    const meanData = _.toString(_.round(_.mean(data),2))
    return ({maxData, meanData, minData})
  }
  
  let statistics = {};
  statistics.beat = statistikData(beat)
  statistics.spo2 = statistikData(spo2)
  statistics.temp = statistikData(temp)

  return (
    <div className="content">
      <table className="sensor-statistics-table">
        <tbody>
          <tr>
            <th className="sensor-data-col"></th>
            <th className="sensor-data-col">Min</th>
            <th className="sensor-data-col">Rata</th>
            <th className="sensor-data-col">Maks</th>
            <th></th>
          </tr>
          <tr>
            <td className="sensor-data-col">
            <FaHeartbeat size={24} />
            </td>
            <td className="sensor-data-col">{statistics.beat.minData}</td>
            <td className="sensor-data-col">{statistics.beat.meanData}</td>
            <td className="sensor-data-col">{statistics.beat.maxData}</td>
            <td className="sensor-unit-col">bpm</td>
          </tr>
          <tr>
            <td className="sensor-data-col">
              <GiLungs size={24} />
            </td>
            <td className="sensor-data-col">{statistics.spo2.minData}</td>
            <td className="sensor-data-col">{statistics.spo2.meanData}</td>
            <td className="sensor-data-col">{statistics.spo2.maxData}</td>
            <td className="sensor-unit-col">%</td>
          </tr>
          <tr>
            <td className="sensor-data-col">
            <WiThermometer size={24} />
            </td>
            <td className="sensor-data-col">{statistics.temp.minData}</td>
            <td className="sensor-data-col">{statistics.temp.meanData}</td>
            <td className="sensor-data-col">{statistics.temp.maxData}</td>
            <td className="sensor-unit-col">°C</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Belakang
import React from 'react'
import DownloadButton from '../DownloadButton'

import { FaHeartbeat } from 'react-icons/fa'
import { GiLungs } from 'react-icons/gi'
import { WiThermometer } from 'react-icons/wi'
import { FiClock } from 'react-icons/fi'

import timeFormatter from '../../config/timeFormatter'

import './styles.css'

const ReportTable = ({ jumlahData, nama, ruang, sensorId, query}) => {

  const mappedData = query.map((item) => item)
  const mappedDataSlice = mappedData.slice(Math.max(mappedData.length -`${jumlahData}`, 0))
  
  return (
    <div className="report-container">
      <DownloadButton
        title="Export to .CSV"
        data={mappedData}
        filename={`${sensorId} - ${nama} - report${new Date()}.csv`}
      />
      <h2>Ruang {sensorId}</h2>
      <h3>{nama}</h3>
      <div className="table-container">
        <table className="report-table">
          <tbody>
            <tr>
              <th className="sensor-data-col">
                <FiClock size={20} title="Timestamp" />
              </th>
              <th className="sensor-data-col">
                <FaHeartbeat size={20} title="Denyut" />
              </th>
              <th className="sensor-data-col">
                <GiLungs size={20} title="SpO2" />
              </th>
              <th className="sensor-data-col">
                <WiThermometer size={20} title="Suhu" />
              </th>
            </tr>
            { mappedDataSlice.reverse().map((item, id) =>
              <tr key={id}>
                {<td className="sensor-data-col">{timeFormatter(item.timestamp, true)}</td>}
                <td className="sensor-data-col"> {item.beat} bpm</td>
                <td className="sensor-data-col"> {item.spo2} %</td>
                <td className="sensor-data-col"> {item.temp} °C</td>
              </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;

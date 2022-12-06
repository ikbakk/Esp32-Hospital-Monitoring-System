import _ from 'lodash'
import React from 'react'
import ReportTable from '../../ReportTable'
import TimeSerieLineChart from '../../TimeSerieLineChart'
import TimeAgoLabel from '../../TimeAgoLabel'

import { ref } from 'firebase/database'
import { database } from '../../../config/firebase'
import { useDatabaseValue } from '@react-query-firebase/database'
import { useParams, useLocation } from 'react-router-dom'

import { FaHeartbeat } from 'react-icons/fa'
import { GiLungs } from 'react-icons/gi'
import { WiThermometer } from 'react-icons/wi'
import { MdDeleteSweep } from 'react-icons/md'

import './stylesDetail.css';

const Detail = () => {
  let { sensorId } = useParams()
  const data = useLocation().state
  const arrayData = _.toArray(data)
  const chartDataMap = (index) => {
    const result = [{pv:arrayData[index], timestamp:arrayData[3]}]
    return result
  }

  const beatStamp = chartDataMap(0)
  const spo2Stamp = chartDataMap(1)
  const tempStamp = chartDataMap(2)

  console.log(arrayData.map((item) => ({pv:item[0]})))

  return (
    <div>
      <div className="sub-header-container-container">
        <div className="sub-header-container">
            <span>Ruangan : {data.ruang}</span>
            <div className="time-label">
              <span>
                <TimeAgoLabel date={_.last(data.timestamp)} short={false} />
              </span>
                <button
                  className="button"
                  // onClick={() => deleteSensorData(id)}
                  type="button"
                  title="Hapus data"
                >
              <MdDeleteSweep size={22} color="red" />
            </button>
          </div>
        </div>
      </div>
      <div className="hospital-bed-container">
        <div className="hb-monitoring-container">
          <div className="info-chart-container">
            <div className="card-container card-info-container">
              <h2>Denyut</h2>
              <FaHeartbeat size={64} />
              <h2>{_.last(data.beat)} bpm</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={beatStamp}
                dataKeyX="timestamp"
                syncId="anyId"
                fillColor="#E0C097"
                unit=" bpm"
                lineName="Denyut"
                tickStep={5}
              />
            </div>
          </div>
          <div className="info-chart-container">
            <div className="card-container card-info-container">
              <h2>SpO2</h2>
              <GiLungs size={64} />
              <h2>{_.last(data.spo2)} %</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={spo2Stamp}
                dataKeyX="timestamp"
                syncId="anyId"
                fillColor="#E0C097"
                unit=" %"
                lineName="SpO2"
                tickStep={5}
                fixedDomain={[(dataMin) => dataMin, 100]}
                rangeLimit={[0, 100]}
              />
            </div>
          </div>
          <div className="info-chart-container">
            <div className="card-container card-info-container">
              <h2>Suhu</h2>
              <WiThermometer size={64} />
              <h2>{_.last(data.temp)} ºC</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={tempStamp}
                dataKeyX="timestamp"
                datakeyY="temp"
                syncId="anyId"
                fillColor="#E0C097"
                unit=" ºC"
                lineName="Suhu"
                tickStep={0.5}
                valueFormatter={(value) => Number(value).toFixed(1)}
              />
            </div>
          </div>
        </div>
        <div className="hb-report-container">
          <ReportTable 
            className="hb-report-table" 
            ruang={"20 Input Terakhir"} 
            sensorId={sensorId} 
            jumlahData={20} 
          />
        </div>
      </div>
    </div>
  )
}

export default Detail

import _ from 'lodash'
import React from 'react'
import ReportTable from '../../ReportTable'
import TimeAgoLabel from '../../TimeAgoLabel'
import TimeSerieLineChart from '../../TimeSerieLineChart'

import { ref } from 'firebase/database'
import { database } from '../../../config/firebase'
import { useParams } from 'react-router-dom'
import { useDatabaseValue } from '@react-query-firebase/database'

import { FaHeartbeat } from 'react-icons/fa'
import { GiLungs } from 'react-icons/gi'
import { WiThermometer } from 'react-icons/wi'

import './stylesDetail.css';

const Detail = () => {
  let { sensorId } = useParams()

  const query = useDatabaseValue(['userId', sensorId], 
  ref(database,`userId/${sensorId}`), 
  { subscribe:true, toArray:false}, 
  {
    placeholderData:
      { key:' ', 
        nama:'Tes', 
        nilai:{'-default': {beat:0, spo2:0, temp:0, timestamp:0}}}
    ,
    keepPreviousData:true,
  })

  const entryObject = (object) => {
    const result = Object.entries(object)
    return result
  }

  const mapNilai = entryObject(query.data.nilai).map((item) => (
    {
      beat:item[1].beat,
      spo2:item[1].spo2,
      temp:item[1].temp,
      timestamp:item[1].timestamp
    }))
  const beat = mapNilai.map((item) => item.beat)
  const spo2 = mapNilai.map((item) => item.spo2)
  const temp = mapNilai.map((item) => item.temp)
  const timestamp = mapNilai.map((item) => item.timestamp)

  const mappedDataSlice = mapNilai.slice(Math.max(mapNilai.length - 120, 0))
    console.log(timestamp)
  return (
    <div>
      <div className="sub-header-container-container">
        <div className="sub-header-container">
            <span>Nama : {query.data.nama}</span>
            <div className="time-label">
              <span>
                <TimeAgoLabel date={_.last(timestamp)} short={false} />
              </span>
          </div>
        </div>
      </div>
      <div className="hospital-bed-container">
        <div className="hb-monitoring-container">
          <div className="info-chart-container">
            <div className="card-container card-info-container">
              <h2>Denyut</h2>
              <FaHeartbeat size={64} />
              <h2>{_.last(beat)} bpm</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={mappedDataSlice}
                dataKeyX="timestamp"
                dataKeyY="beat"
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
              <h2>{_.last(spo2)} %</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={mappedDataSlice}
                dataKeyX="timestamp"
                dataKeyY="spo2"
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
              <h2>{_.last(temp)} ºC</h2>
            </div>
            <div className="card-container card-chart-container">
              <TimeSerieLineChart
                data={mappedDataSlice}
                dataKeyX="timestamp"
                dataKeyY="temp"
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
            ruang={sensorId} 
            sensorId={sensorId} 
            jumlahData={20}
            query={mapNilai} 
          />
        </div>
      </div>
    </div>
  )
}

export default Detail

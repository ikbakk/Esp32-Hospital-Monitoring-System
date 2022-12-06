import _ from 'lodash'
import React from 'react'
import { ref } from 'firebase/database'
import { database } from '../../../config/firebase'
import { useDatabaseValue } from '@react-query-firebase/database'

import GenericBarChart from '../../GenericBarChart'
// import emptySensorData from '../../helpers/emptySensorData'

import './styles.css';

const Grafik = () => {
  const query = useDatabaseValue(['userId'], 
  ref(database,`userId/`), 
  { subscribe:true, toArray:false}, 
  {
    placeholderData:[
      {key:' ', nama:'Tes', nilai:[{beat:' ', spo2:' ', temp:' ', timestamp:' '}]}
    ],
    keepPreviousData:true,
    staleTime:Infinity,
  })

  const entryObject = (object) => {
    const result = Object.entries(object)
    return result
  }

  const data = entryObject(query.data)
  const mappedData = data.map((item, id,
    { sensorIdData = entryObject(item[1]).map((item) => item[1]),
      nilai = entryObject(sensorIdData[1]).map((item) => item[1]),
      beat = nilai.map((item) => item.beat),
      spo2 = nilai.map((item) => item.spo2),
      temp = nilai.map((item) => item.temp),
    }) => ({beat:_.last(beat), nama:'Ruang '+(item[0]),  spo2:_.last(spo2), temp:_.last(temp)}) )

  return (
    <div className="aggregated-charts-container">
      <div className="info-chart-container">
        <GenericBarChart
          data={mappedData}
          dataKeyX="nama"
          syncId="anyId"
          dataKeyY="beat"
          barName="Denyut"
          unit=" bpm"
          fillColor="#B85C38"
        />
      </div>
      <div className="info-chart-container">
        <GenericBarChart
          data={mappedData}
          dataKeyX="nama"
          syncId="anyId"
          dataKeyY="spo2"
          barName="SpO2"
          unit="%"
          fillColor="#B85C38"
        />
      </div>
      <div className="info-chart-container">
        <GenericBarChart
          data={mappedData}
          dataKeyX="nama"
          syncId="anyId"
          dataKeyY="beat"
          barName="Suhu"
          unit="°C"
          fillColor="#B85C38"
        />
      </div>
    </div>
  )
}

export default Grafik

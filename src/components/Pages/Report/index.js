import React from 'react'
import ReportTable from '../../ReportTable'

import { ref } from 'firebase/database'
import { database } from '../../../config/firebase'
import { useDatabaseValue } from '@react-query-firebase/database'

const Report = () => {

  const query = useDatabaseValue(['userId'], 
  ref(database,`userId/`), 
  { subscribe:true, toArray:false}, 
  {
    placeholderData:[
      {key:' ', nama:'Tes', nilai:[{beat:' ', spo2:' ', temp:' ', timestamp:' '}]}
    ],
    keepPreviousData:true,
  })

  const mappedData = Object.entries(query.data)
  const entryObject = (object) => {
    const result = Object.entries(object)
    return result
  }
  
  return (
    <div className="monitor-container">
      <div className="beds-container">
      {mappedData.map((item, id, 
          {sensorId = item[0],
            nama = item[1].nama, 
            sensorIdData = entryObject(item[1]).map((item) => item[1]),
            nilai = entryObject(sensorIdData[1]).map((item) => item[1]),
            beat = nilai.map((item) => item.beat),
            spo2 = nilai.map((item) => item.spo2),
            temp = nilai.map((item) => item.temp),
            time = nilai.map((item) => item.timestamp) 
          }) =>
            <ReportTable
              beat={beat}
              jumlahData={5}
              key={id} 
              nama={nama}
              query={nilai} 
              ruang={id+1} 
              sensorId={sensorId}
              spo2={spo2}
              temp={temp}
              timestamp={time}
            /> 
        )}
      </div>
    </div>
  )
}

export default Report

import React, {useState} from "react"
import Card from "../../Card"
import AddModal from "../../AddButton"

import { ref } from 'firebase/database'
import { database } from '../../../config/firebase'
import { useDatabaseValue } from '@react-query-firebase/database'

import { TiUserAddOutline } from 'react-icons/ti'

import './styles.css'

const Home = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const onSubmit = (event) => {
    event.preventDefault()
    setOpen(false)
  }

  const query = useDatabaseValue(['userId'], 
  ref(database,`userId/`), 
  { subscribe:true, toArray:false}, 
  {
    placeholderData:[
      {key:' ', nama:'Tes', nilai:[{beat:' ', spo2:' ', temp:' ', timestamp:' '}]}
    ],
    keepPreviousData:true,
  })
  
  const entryObject = (object) => {
    const result = Object.entries(object)
    return result
  }

  const mappedData = entryObject(query.data)

  return (
    <div className="monitor-container">
      <div className="beds-container">
      {mappedData.map((item, id, 
          {sensorId = item[0],
            nama = item[1].nama, 
            sensorIdData = entryObject(item[1]).map((item) => item[1]),
            nilai = entryObject(sensorIdData[1]).map((item) => item[1]),
            nilaiChart = entryObject(nilai).map((item) => item[1]),
            beat = nilai.map((item) => item.beat),
            spo2 = nilai.map((item) => item.spo2),
            temp = nilai.map((item) => item.temp),
            time = nilai.map((item) => item.timestamp) 
          }) =>
            <Card 
              beat={beat}
              key={id} 
              nama={nama}
              nilai={nilaiChart}
              ruang={id+1} 
              sensorId={sensorId}
              spo2={spo2}
              temp={temp}
              timestamp={time}
            />
        )}
      </div>
      <TiUserAddOutline onClick={handleOpen} className="add" size={24}/>
      <AddModal open={open} handleClose={handleClose} onSubmit={onSubmit}  />
    </div>
  )
}
export default Home
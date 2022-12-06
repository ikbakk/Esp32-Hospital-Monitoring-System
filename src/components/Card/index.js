import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { infoToast, errorToast, warningToast } from '../ToastNotif'

import _ from 'lodash'
import Depan from './Depan'
import Belakang from './Belakang'
import BasicModal from '../Modal'
import TimeAgoLabel from '../TimeAgoLabel'
import TimeIntervalLabel from '../TimeIntervalLabel'

import { ref } from 'firebase/database'
import { database } from '../../config/firebase'
import { useDatabaseRemoveMutation } from '@react-query-firebase/database'
import { useDatabaseUpdateMutation } from '@react-query-firebase/database'

import { GoX } from 'react-icons/go'
import { MdOutlineDelete } from 'react-icons/md'
import { RiEditLine } from 'react-icons/ri'
import { IoReturnDownBackOutline } from 'react-icons/io5'

import './styles.css'

const Card = ({nama, sensorId, ruang, beat, spo2, temp, timestamp, nilai}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const mutationDelete = useDatabaseRemoveMutation(ref(database, `userId/${sensorId}`))
  const mutationEmpty = useDatabaseUpdateMutation(ref(database, `userId/${sensorId}`))
 

  const deleteNode = (event) => {
    event.stopPropagation()
    const result = mutationDelete.mutate()
    return result
  }

  const emptyNode = (event) => {
    event.stopPropagation()
    const result = mutationEmpty.mutate({
      nama: `Nama Ruang ${sensorId}`,
      nilai: {"-NHFthuz-7J7H71noisX": {beat:0, spo2:0, temp:0, timestamp:0}}
    })
    return result
  }
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  let navigate = useNavigate()
  const handleCardClick = () => {
    navigate(`detail/${sensorId}`) 
  }

  const handleFlipCard = (event) => {
    event.stopPropagation();
    setIsCardFlipped(!isCardFlipped)
  }

  const range = (lodashFunc) => {
    const rangeBeat = _.inRange((lodashFunc)(_.compact(beat)),60, 100)
    const rangeSpo2 = _.inRange((lodashFunc)(_.compact(spo2)),95, 100)
    const rangeTemp = _.inRange((lodashFunc)(_.compact(temp)),36.1, 37.2)
    return {a:rangeBeat, b:rangeSpo2, c:rangeTemp}
  }

  let meanReading = range(_.mean)

  const danger = {a:false, b:false, c:false}
  const warnBeat = {a:false, b:true, c:true}
  const warnOxy = {a:true, b:false, c:true}
  const warnTemp = {a:true, b:true, c:false}

  const colorCode = (object) => {
    let result = ' '
    let message = ' '
    if ( _.isEqual( _.mean(beat), 0 ) ) {
      result = 'alert-bar disabled'
      message = `Data ${_.upperCase(nama)} tidak tersedia di RUANG ${_.upperCase(sensorId)}`
    } else if ( _.isEqual( object, danger ) ){
      result = 'alert-bar danger'
      message = `Periksa oksimeter dan sensor suhu ${_.upperCase(nama)} di RUANG ${_.upperCase(sensorId)}`
    } else if ( _.isEqual( object, warnOxy )) {
      result = 'alert-bar warning1'
      message = `Periksa oksimeter ${_.upperCase(nama)} di RUANG ${_.upperCase(sensorId)}`
    } else if ( _.isEqual( object, warnBeat )) {
      result = 'alert-bar warning1'
      message = `Periksa oksimeter ${_.upperCase(nama)} di RUANG ${_.upperCase(sensorId)}`
      }else if ( _.isEqual( object, warnTemp ) ){
      result = 'alert-bar warning2' 
      message = `Periksa sensor suhu ${_.upperCase(nama)} di RUANG ${_.upperCase(sensorId)}`
    } else {
      result = 'alert-bar normal'
      message = ' '
    }
    return {className:result, toast:message}
  }

  // const toastAlert = () => {
  //   const message = colorCode(meanReading).toast
  //   const result = colorCode(meanReading).className
  //   if ( _.isEqual(result, 'alert-bar disabled') ) {
  //     infoToast(message, sensorId)
  //   } else if ( _.isEqual(result, 'alert-bar danger') ) {
  //     errorToast(message, sensorId)
  //   } else if ( _.isEqual(result, 'alert-bar warning1') ) {
  //     warningToast(message, sensorId)
  //   } else if ( _.isEqual(result, 'alert-bar warning2') ) {
  //     warningToast(message, sensorId)
  //   } else {
  //   }
  // }
    
  // toastAlert()
  
  const onSubmit = (event) => {
    event.preventDefault()
    setOpen(false)
  }

  return (
    <div className="card-container-holder">
      <div onClick={handleCardClick} className={isCardFlipped ? 'card-container is-flipped' : 'card-container'}>
      {/* Kartu bagian depan  */}
        <div className="card-face front-card-container" color='#E0C097'>
          <div onClick={(e)=>e.stopPropagation()} className={colorCode(meanReading).className}>
          <button onClick={handleOpen} className='edit button' title='Edit data' >
            <RiEditLine style={{marginBottom:'-3px'}} color='#5C3D2E' size={22} />
          </button>
          <button onClick={deleteNode} type='button' title='Hapus' className='button delete '>
            <GoX color='#5C3D2E' size={22} />
          </button>
            <h1>Ruang {sensorId}</h1>
          </div>
          <div className='nama'><h3>{nama}</h3></div>
          <Depan beat={_.last(beat)} spo2={_.last(spo2)} temp={_.last(temp)}/>
          <div className="time-label">
            <TimeAgoLabel date={_.last(timestamp)} />
          </div>
          <button className='button empty'>
            <MdOutlineDelete onClick={emptyNode} title='Reset data' color='#E0C097' size={22} />
          </button>
          <button className="button" onClick={(event) => handleFlipCard(event)} type="button" title="Lihat Statistik">
            <IoReturnDownBackOutline color='#E0C097' size={24} />
          </button>
        </div>
      {/* Kartu bagian belakang */}
        <div className="card-face back-card-container">
          <div className={colorCode(meanReading).className}>
          <button onClick={handleOpen} className='edit button' title='Edit data' >
            <RiEditLine style={{marginBottom:'-3px'}} color='#5C3D2E' size={22} />
          </button>
          <button onClick={deleteNode} type='button' title='Hapus' className='button delete '>
            <GoX color='#5C3D2E' size={22} />
          </button>
            <h1>Ruang {sensorId}</h1>
          </div>
          <div className='nama'><h4>{nama}</h4></div>
          <Belakang beat={_.compact(beat)} spo2={_.compact(spo2)} temp={_.compact(temp)} />
          <div className="time-label-back">
            <TimeIntervalLabel start={_.head(timestamp)} end={_.last(timestamp)} />
            <p>ID Sensor: {sensorId}</p>
          </div>
          <button className="button" onClick={(event) => handleFlipCard(event)} type="button" title="Lihat Data Realtime">
            <IoReturnDownBackOutline color='#E0C097' size={24} />
          </button>
          <button className='button empty'>
            <MdOutlineDelete onClick={emptyNode} title='Reset data' color='#E0C097' size={22} />
          </button>
        </div>
      </div>
      <BasicModal id={sensorId} onSubmit={onSubmit} open={open} handleClose={handleClose} />
    </div>
  )
}

export default Card 
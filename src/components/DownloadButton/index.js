import React from 'react';
import { CSVLink } from 'react-csv';
import timeFormatter from '../../config/timeFormatter'

import { AiOutlineCloudDownload } from 'react-icons/ai';

import './styles.css';

const DownloadButton = ({ data, filename, title }) => {
  const headers = [
    { label: 'Data', key: 'timestamp' },
    { label: 'Denyut (bpm)', key: 'beat' },
    { label: 'SpO2 (%)', key: 'spo2' },
    { label: 'Suhu (°C)', key: 'temp' },
  ];

  const mappedData = data.map((item, {a =timeFormatter(item.timestamp)}) => ({
      beat:item.beat, 
      spo2:item.spo2, 
      temp:item.temp, 
      timestamp:a
    })
  )
 
  return (
    <CSVLink data={mappedData} headers={headers} separator=";" filename={filename} target="_blank">
      <AiOutlineCloudDownload className="download-button" size={34} title={title} />
    </CSVLink>
  );
};

export default DownloadButton;

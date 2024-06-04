import React, { useState, useEffect, useRef } from 'react';
import { User } from '@/type';
import _ from 'lodash';
import TimeIntervalLabel from '../TimeIntervalLabel';
import { useDatabaseSetMutation } from '@react-query-firebase/database';
import { Database, ref } from 'firebase/database';
import { db } from '@/utils/firebase';

type AverageReadingProps = {
  data: User | undefined;
};

type RecordedData = {
  beat: number;
  spo2: number;
  temp: number;
  timestamp: number;
};

const AverageReading: React.FC<AverageReadingProps> = ({ data }) => {
  const [recordName, setRecordName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState<RecordedData[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const nilai = Object.values(data?.nilai ?? {});
  const latestNilai = _.last(nilai);

  const dbRef = ref(db, `recording-${recordName}`);
  const mutation = useDatabaseSetMutation(dbRef);
  const startRecording = () => {
    if (recordName === '') {
      alert('Please enter a name for the recording');
    } else {
      setIsRecording(true);
      console.log('mulai');
      setRecordedData([]); // Reset recorded data
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    alert('Recording stopped');

    mutation.mutate(recordedData);
  };

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        if (latestNilai) {
          setRecordedData((prevData) => {
            // Check if the latest data point is already in the recordedData array
            if (!prevData.some(isEqualData(latestNilai))) {
              return [...prevData, latestNilai]; // Add unique data points
            }
            return prevData; // Otherwise, keep the array as it is
          });
        }
      }, 1000); // Record data every second

      const timeoutId = setTimeout(() => {
        stopRecording();
      }, 60000); // Stop recording after 1 minute

      return () => {
        clearTimeout(timeoutId);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRecording, data]);

  const isEqualData = (data1: RecordedData) => (data2: RecordedData) =>
    data1.beat === data2.beat &&
    data1.spo2 === data2.spo2 &&
    data1.temp === data2.temp &&
    data1.timestamp === data2.timestamp;

  const avrg = (arr: RecordedData[], value: string) => {
    const result = _.meanBy(arr, value).toFixed(2);

    return result;
  };

  return (
    <div className='flex gap-4'>
      <div>
        <input
          className='border-2 border-gray-300 px-3 py-1'
          placeholder='Record Name'
          type='text'
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
        />
        <button
          className='bg-gray-300 px-3 py-1 disabled:bg-gray-900 disabled:text-white'
          onClick={startRecording}
          disabled={isRecording}
        >
          Start
        </button>
        <button
          className='bg-gray-300 px-3 py-1 disabled:bg-gray-900 disabled:text-white'
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop
        </button>
      </div>

      {recordedData.length > 0 && (
        <div>
          <h3>Rata-rata</h3>
          <div className='flex gap-4'>
            <p>Heartbeat: {avrg(recordedData, 'beat')}</p>
            <p>SPO2: {avrg(recordedData, 'spo2')}</p>
            <p>Temperature: {avrg(recordedData, 'temp')}</p>
          </div>
          <div className='flex items-center gap-4'>
            Waktu:
            <TimeIntervalLabel
              start={recordedData[0].timestamp}
              end={recordedData[recordedData.length - 1].timestamp}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AverageReading;

'use client';

import React from 'react';
import { User } from '@/type';
import { useParams } from 'next/navigation';
import { dynamicPathRef } from '@/utils/firebase';
import { useDatabaseValue } from '@react-query-firebase/database';

import DetailHeader from '@/components/Detail/DetailHeader';
import DetailReading from '@/components/Detail/DetailReading';
import { FaHeartbeat, FaLungs, FaTemperatureHigh } from 'react-icons/fa';
import ReportTable from '@/components/ReportTable';

const DetailPage = () => {
  const slug = Number(useParams().slug);
  const dbRef = dynamicPathRef(slug);

  const { data, isLoading } = useDatabaseValue<User>([`userId/${slug}`], dbRef);

  const nilai = Object.values(data?.nilai ?? []);
  const beat = data?.nilai ? nilai.map(n => n.beat) : [0];
  const spo2 = data?.nilai ? nilai.map(n => n.spo2) : [0];
  const temp = data?.nilai ? nilai.map(n => n.temp) : [0];
  const timestamp = data?.nilai ? nilai.map(n => n.timestamp) : [0];

  return (
    <>
      {isLoading ? (
        <div className='flex h-screen items-center justify-center'>
          <p>Loading...</p>
        </div>
      ) : (
        <div className='flex w-full flex-col pt-12'>
          <div className='sticky top-0 z-30 justify-center p-6 lg:px-20'>
            <DetailHeader
              name={data?.nama ?? ''}
              time={timestamp[timestamp.length - 1]}
            />
          </div>
          <div className='flex w-full flex-row justify-evenly p-6 lg:px-20'>
            <div className='flex w-full flex-col space-y-5'>
              <DetailReading
                title='Heart Rate'
                dataKeyY='beat'
                icon={<FaHeartbeat size={80} />}
                nilai={nilai}
                numberArr={beat}
                unit='bpm'
              />
              <DetailReading
                title='Spo2'
                dataKeyY='spo2'
                icon={<FaLungs size={80} />}
                nilai={nilai}
                numberArr={spo2}
                unit='%'
              />
              <DetailReading
                title='Temperature'
                dataKeyY='temp'
                icon={<FaTemperatureHigh size={80} />}
                nilai={nilai}
                numberArr={temp}
                unit='°C'
              />
              <ReportTable
                name={data?.nama ?? ''}
                nilai={nilai}
                sensorId={slug}
                showName={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailPage;

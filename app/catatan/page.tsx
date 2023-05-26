'use client';

import { useDatabaseValue } from '@react-query-firebase/database';
import { mainPathRef } from '../../utils/firebase';
import { User } from '../../type';
import ReportTable from '@/components/ReportTable';

const Catatan = () => {
  const { data, isLoading } = useDatabaseValue<User[]>(
    ['userId'],
    mainPathRef,
    { subscribe: true }
  );

  return (
    <>
      {isLoading ? (
        <div className='flex h-screen w-full items-center justify-center'>
          <p>Loading...</p>
        </div>
      ) : (
        <div className='w-full py-16'>
          <div className='flex w-full flex-row flex-wrap justify-evenly gap-y-10'>
            {data?.map((data, index) => (
              <div key={index} className='mx-2 my-2 w-80'>
                <ReportTable
                  name={data.nama}
                  sensorId={index}
                  nilai={Object.values(data.nilai)}
                  showName
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Catatan;

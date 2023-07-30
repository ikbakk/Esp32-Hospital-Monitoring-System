'use client';

import { User } from '@/type';
import { mainPathRef } from '@/utils/firebase';
import { useDatabaseValue } from '@react-query-firebase/database';

import RoomCard from '@/components/RoomCard';
import RoomCardContextProvider from '@/components/RoomCard/RoomCardContextProvider';

export default function Home() {
  const { data, isLoading } = useDatabaseValue<User[]>(
    ['userId'],
    mainPathRef,
    { subscribe: true }
  );

  return (
    <>
      {isLoading ? (
        <div className='flex h-screen items-center justify-center'>
          <p>Loading...</p>
        </div>
      ) : (
        <div className='w-full py-16'>
          <div className='flex h-full flex-row flex-wrap justify-evenly'>
            {data?.map(data => (
              <RoomCardContextProvider
                roomNumber={data.noKamar ?? 0}
                key={data.nama.toLowerCase()}>
                <RoomCard data={data} isLoading={isLoading} />
              </RoomCardContextProvider>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

'use client';
import { User } from '@/type';
import { useDatabaseValue } from '@react-query-firebase/database';

import RoomCard from '@/components/RoomCard';
import RoomCardContextProvider from '@/components/RoomCard/RoomCardContextProvider';
import ModalContextProvider from '@/components/Modals/ModalContextProvider';
import Modal from '@/components/Modals';
import { mainPathRef } from '../../utils/firebase';

type RoomCardsProps = {
  initialData: User[];
};

const RoomCards = ({ initialData }: RoomCardsProps) => {
  const { data } = useDatabaseValue<User[]>(['userId'], mainPathRef, {
    subscribe: true,
  }, {
    initialData
  });

  return (
    <div className='w-full py-16'>
      <div className='flex h-full flex-row flex-wrap justify-evenly'>
        {data
          ? data?.map((data) => (
              <RoomCardContextProvider
                roomNumber={data.noKamar ?? 0}
                key={data.nama.toLowerCase() + data.noKamar}
              >
                <ModalContextProvider>
                  <RoomCard noKamar={data.noKamar} />
                  <Modal />
                </ModalContextProvider>
              </RoomCardContextProvider>
            ))
          : null}
      </div>
    </div>
  );
};

export default RoomCards;

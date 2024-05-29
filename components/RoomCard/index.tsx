import { User } from '@/type';
import { useContext } from 'react';
import { CardContext } from '@/utils/CardContext';

import CardFace from './CardFace';
import Link from 'next/link';
import { useDatabaseValue } from '@react-query-firebase/database';
import { dynamicPathRef } from '@/utils/firebase';

interface RoomCardContainerProps {
  noKamar: number;
}

const RoomCard = ({ noKamar }: RoomCardContainerProps) => {
  const { isFlipped } = useContext(CardContext);
  const { data: roomData } = useDatabaseValue<User>(
    [`userId/${noKamar - 1}`],
    dynamicPathRef(noKamar - 1),
    {
      subscribe: true,
    }
  );

  const cardRotationClassName = isFlipped
    ? '[transform:rotateY(180deg)]'
    : '[transform:rotateY(0deg)]';

  const cardCurrentState = (
    <>
      <CardFace
        nama={roomData?.nama!}
        nilai={roomData?.nilai!}
        roomNumber={noKamar ?? 0}
        side='front'
      />
      <CardFace
        nama={roomData?.nama!}
        nilai={roomData?.nilai!}
        roomNumber={noKamar ?? 0}
        side='back'
      />
    </>
  );

  return (
    <Link href={`/detail/${noKamar - 1}`} className='card-container mx-2 my-2'>
      <div className={`${cardRotationClassName} card-face-body`}>
        {roomData?.nilai ? <>{cardCurrentState}</> : <div>...</div>}
      </div>
    </Link>
  );
};

export default RoomCard;

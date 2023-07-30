import { User } from '@/type';
import { FC, useContext } from 'react';
import { CardContext } from './RoomCardContextProvider';

import Loading from './Loading';
import CardFace from './CardFace';

interface RoomCardContainerProps {
  data: User;
  isLoading: boolean;
}

const RoomCard: FC<RoomCardContainerProps> = ({ isLoading, data }) => {
  const { nama, nilai, noKamar } = data;
  const { isFlipped } = useContext(CardContext);

  const cardRotationClassName = isFlipped
    ? '[transform:rotateY(180deg)]'
    : '[transform:rotateY(0deg)]';

  const cardCurrentState = (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <CardFace
            nama={nama}
            nilai={nilai}
            roomNumber={noKamar ?? 0}
            side='front'
          />
          <CardFace
            nama={nama}
            nilai={nilai}
            roomNumber={noKamar ?? 0}
            side='back'
          />
        </>
      )}
    </>
  );

  return (
    <div className='card-container mx-2 my-2'>
      <div className={`${cardRotationClassName} card-face-body`}>
        {cardCurrentState}
      </div>
    </div>
  );
};

export default RoomCard;

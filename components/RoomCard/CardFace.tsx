import { Nilai } from '@/type';
import { FC, useContext } from 'react';
import { CardContext } from './RoomCardContextProvider';
import useNormalRange from '@/app/hooks/useNormalRange';
import useColorCode from '@/app/hooks/useColorCode';
import useDataExtraction from '@/app/hooks/useDataExtraction';

import Header from './Header';
import Footer from './Footer';
import FrontSideBody from './FrontSideBody';
import BackSideBody from './BackSideBody';

interface CardFaceProps {
  roomNumber: number;
  nama: string;
  nilai: Nilai;
  side: 'front' | 'back';
}

const CardFace: FC<CardFaceProps> = ({ roomNumber, nama, nilai, side }) => {
  const normalRange = useNormalRange(nilai);
  const colorCode = useColorCode(normalRange);
  const { beat, spo2, temp, timestamp } = useDataExtraction(nilai);
  const { setDialogTitle, setType, setIsFlipped, isFlipped } =
    useContext(CardContext);

  const firstTimestamp = timestamp[0];
  const latestTimestamp = timestamp[timestamp.length - 1];

  const handleDelete = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setDialogTitle('Are you sure?');
    setType('delete');
  };

  const handleEditName = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setDialogTitle(`Edit Room ${roomNumber + 1} Info`);
    setType('edit');
  };

  const handleCardFlip = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const cardSidesClassName =
    side === 'front' ? 'card-face-front' : 'card-face-back';

  const cardSides =
    side === 'front' ? (
      <FrontSideBody beat={beat} spo2={spo2} temp={temp} nama={nama} />
    ) : (
      <BackSideBody beat={beat} spo2={spo2} temp={temp} nama={nama} />
    );

  return (
    <div className={`card-face ${cardSidesClassName}`}>
      <Header
        roomNumber={roomNumber}
        handleEditName={handleEditName}
        handleDelete={handleDelete}
        colorCode={colorCode}
      />
      {cardSides}
      <Footer
        firstTimestamp={firstTimestamp}
        latestTimestamp={latestTimestamp}
        handleCardFlip={handleCardFlip}
      />
    </div>
  );
};

export default CardFace;

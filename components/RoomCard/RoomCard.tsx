'use client';

import { useRouter } from 'next/navigation';
import { User } from '@/type';
import { FC, useState, createContext } from 'react';

import BackSide from './BackSide';
import FrontSide from './FrontSide';
import Modal from '../Modal';

interface CardContext {
  type: 'edit' | 'add' | 'delete' | null;
  setType: React.Dispatch<
    React.SetStateAction<'edit' | 'add' | 'delete' | null>
  >;
  dialogTitle: string;
  setDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  id: number;
}

interface Props {
  dataUser: User;
  isLoading: boolean;
  id: number;
}

export const CardContext = createContext<CardContext>({} as CardContext);

const RoomCard: FC<Props> = ({ isLoading, dataUser, id }) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [type, setType] = useState<'edit' | 'add' | 'delete' | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');

  const { nama, nilai } = dataUser;

  const beat = Object.values(nilai).map(n => n.beat);
  const spo2 = Object.values(nilai).map(n => n.spo2);
  const temp = Object.values(nilai).map(n => n.temp);
  const timestamp = Object.values(nilai).map(n => n.timestamp);

  const flip = isFlipped
    ? '[transform:rotateY(180deg)]'
    : '[transform:rotateY(0deg)]';

  const handleClick = () => {
    router.push(`detail/${id}`);
  };

  const cardProps = {
    nama,
    id,
    beat,
    spo2,
    temp,
    timestamp,
    isFlipped,
    setIsFlipped,
    handleClick
  };

  const contextValue = {
    type,
    setType,
    id,

    dialogTitle,
    setDialogTitle
  };

  return (
    <CardContext.Provider value={contextValue}>
      <div className='card-container mx-2 my-2'>
        <div className={`${flip} card-face-body`}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <FrontSide {...cardProps} />
              <BackSide {...cardProps} />
            </>
          )}
        </div>
      </div>
      <Modal dialogTitle={dialogTitle} />
    </CardContext.Provider>
  );
};

export default RoomCard;

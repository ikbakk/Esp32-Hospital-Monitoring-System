'use client';

import { useRouter } from 'next/navigation';
import { User } from '@/type';
import { FC, useState, createContext, memo, useMemo, useCallback } from 'react';

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

const RoomCard: FC<Props> = memo(({ isLoading, dataUser, id }) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [type, setType] = useState<'edit' | 'add' | 'delete' | null>(null);
  const [dialogTitle, setDialogTitle] = useState('');

  const { nilai } = dataUser;
  const [beat, spo2, temp, timestamp] = Object.keys(nilai).reduce(
    ([beat, spo2, temp, timestamp], key) => {
      const { beat: b, spo2: s, temp: t, timestamp: ts } = nilai[key];
      return [
        [...beat, b],
        [...spo2, s],
        [...temp, t],
        [...timestamp, ts]
      ];
    },
    [[], [], [], []] as [number[], number[], number[], number[]]
  );

  const flip = isFlipped
    ? '[transform:rotateY(180deg)]'
    : '[transform:rotateY(0deg)]';

  const handleClick = useCallback(() => {
    router.push(`detail/${id}`);
  }, [id, router]);

  const cardProps = useMemo(
    () => ({
      nama: dataUser.nama,
      id,
      beat,
      spo2,
      temp,
      timestamp,
      isFlipped,
      setIsFlipped,
      handleClick
    }),
    [beat, dataUser.nama, handleClick, id, isFlipped, spo2, temp, timestamp]
  );

  const contextValue = useMemo(
    () => ({
      type,
      setType,
      id,
      dialogTitle,
      setDialogTitle
    }),
    [dialogTitle, id, type]
  );

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
});

export default RoomCard;

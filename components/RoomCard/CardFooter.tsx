import { FC, SetStateAction, useContext } from 'react';
import { CardContext } from '@/utils/CardContext';

import TimeIntervalLabel from '../TimeIntervalLabel';
import { MdOutlineKeyboardReturn } from 'react-icons/md';

interface Props {
  timestamp: number[];
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<SetStateAction<boolean>>;
}

const CardFooter: FC<Props> = ({ timestamp, isFlipped, setIsFlipped }) => {
  const start = timestamp[0];
  const end = timestamp[timestamp.length - 1];

  const pressHandle = (event: React.MouseEvent<SVGElement>) => {
    event.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <TimeIntervalLabel className='' start={start} end={end} />
      <MdOutlineKeyboardReturn
        onClick={pressHandle}
        className='card-button'
        size={20}
      />
    </>
  );
};

export default CardFooter;

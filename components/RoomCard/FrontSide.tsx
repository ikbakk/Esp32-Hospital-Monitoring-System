'use client';

import _ from 'lodash';
import { FC, SetStateAction } from 'react';

import CardHeader from './CardHeader';
import CardFooter from './CardFooter';
import { FaHeartbeat, FaLungs, FaTemperatureHigh } from 'react-icons/fa';

interface Props {
  id: number;
  nama: string;
  beat: number[];
  spo2: number[];
  temp: number[];
  timestamp: number[];
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<SetStateAction<boolean>>;
  handleClick: () => void;
}

const FrontSide: FC<Props> = ({
  id,
  nama,
  beat,
  spo2,
  temp,
  timestamp,
  isFlipped,
  setIsFlipped,
  handleClick
}) => {
  const danger = { a: false, b: false, c: false };
  const warnBeat = { a: false, b: true, c: true };
  const warnOxy = { a: true, b: false, c: true };
  const warnTemp = { a: true, b: true, c: false };

  const range = () => {
    const rangeBeat = _.inRange(_.mean(_.compact(beat)), 60, 100);
    const rangeSpo2 = _.inRange(_.mean(_.compact(spo2)), 95, 100);
    const rangeTemp = _.inRange(_.mean(_.compact(temp)), 36.1, 37.2);
    return { a: rangeBeat, b: rangeSpo2, c: rangeTemp };
  };

  const paramRange = range();

  const colorCode = (object: { [key: string]: boolean }) => {
    if (_.isEqual(_.mean(beat), 0)) {
      return 'bg-abu';
    } else if (_.isEqual(object, danger)) {
      return 'bg-merah';
    } else if (
      _.isEqual(object, warnOxy) === true ||
      _.isEqual(object, warnTemp) === true ||
      _.isEqual(object, warnBeat) === true
    ) {
      return 'bg-kuning';
    } else {
      return 'bg-hijauTerang';
    }
  };
  return (
    <div onClick={handleClick} className='card-face card-face-front'>
      <section id='card-header' className={`${colorCode(paramRange)}`}>
        <CardHeader id={id} />
      </section>
      <section
        id='card-content-body'
        className='h-full w-full gap-1 rounded-b-xl'>
        <div className='flex h-1/4 items-center justify-center text-center text-lg'>
          <h3>{nama}</h3>
        </div>
        <div className='h-3/4'>
          <div className='grid grid-rows-3 items-center gap-4 px-3'>
            <div className='flex flex-row items-center justify-between'>
              <FaHeartbeat size={24} />
              <p className='text-lg'>{beat[beat.length - 1]} bpm</p>
            </div>
            <div className='flex flex-row items-center justify-between'>
              <FaLungs size={24} />
              <p className='text-lg'>{spo2[spo2.length - 1]} %</p>
            </div>
            <div className='flex flex-row items-center justify-between'>
              <FaTemperatureHigh size={24} />
              <p className='text-lg'>{temp[temp.length - 1]} °C</p>
            </div>
          </div>
        </div>
      </section>
      <section id='card-footer'>
        <CardFooter
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          timestamp={timestamp}
        />
      </section>
    </div>
  );
};

export default FrontSide;

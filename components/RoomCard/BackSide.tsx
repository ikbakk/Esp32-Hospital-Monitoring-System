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

const BackSide: FC<Props> = ({
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
  const statistics = (data: number[]) => {
    if (data === undefined) {
      return { maxData: '--', avgData: '--', minData: '--' };
    }
    const maxData = _.max(data);
    const minData = _.min(data);
    const avgData = _.round(_.mean(data), 2).toString();

    return { maxData, avgData, minData };
  };

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
    <div onClick={handleClick} className='card-face card-face-back'>
      <section id='card-header' className={`${colorCode(paramRange)}`}>
        <CardHeader id={id} />
      </section>
      <section
        id='card-content-body'
        className='h-full w-full gap-1 rounded-b-xl'>
        <div className='flex h-1/4 items-center justify-center text-center text-lg'>
          <h3>{nama}</h3>
        </div>
        <table className='flex h-3/4 justify-center'>
          <tbody className='h-full'>
            <tr className='text-center'>
              <th></th>
              <th>Min</th>
              <th>Avrg</th>
              <th>Max</th>
            </tr>
            <tr className='py-2 text-center'>
              <td>
                <FaHeartbeat size={22} />
              </td>
              <td>{statistics(beat).minData}</td>
              <td>{statistics(beat).avgData}</td>
              <td>{statistics(beat).maxData}</td>
              <td className='text-right'>bpm</td>
            </tr>
            <tr className='py-2 text-center'>
              <td>
                <FaLungs size={22} />
              </td>
              <td>{statistics(spo2).minData}</td>
              <td>{statistics(spo2).avgData}</td>
              <td>{statistics(spo2).maxData}</td>
              <td className='text-right'>%</td>
            </tr>
            <tr className='py-2 text-center'>
              <td>
                <FaTemperatureHigh size={22} />
              </td>
              <td>{statistics(temp).minData}</td>
              <td>{statistics(temp).avgData}</td>
              <td>{statistics(temp).maxData}</td>
              <td className='text-right'>°C</td>
            </tr>
          </tbody>
        </table>
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

export default BackSide;

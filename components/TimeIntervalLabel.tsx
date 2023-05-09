import { FC } from 'react';
import timeFormatter from '@/utils/timeFormatter';

interface Props {
  start: number;
  end: number;
  className?: string;
}

const TimeIntervalLabel: FC<Props> = ({ start, end, className }) => {
  if (isNaN(start)) {
    return <span>No Data</span>;
  }

  return (
    <div className={className}>
      <span>
        {timeFormatter(start, false)} - {timeFormatter(end, false)}
      </span>
    </div>
  );
};

export default TimeIntervalLabel;

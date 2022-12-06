import React from 'react';

import timeFormatter from '../../config/timeFormatter';

const TimeIntervalLabel = ({ start, end }) => {
  if (isNaN(start)) {
    return <span>Tidak ada data</span>;
  }

  return (
    <span>
      Antara {timeFormatter(start)} - {timeFormatter(end)}
    </span>
  );
};

export default TimeIntervalLabel;

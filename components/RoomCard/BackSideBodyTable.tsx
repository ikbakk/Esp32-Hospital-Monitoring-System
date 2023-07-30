'use client';

import { FC, ReactNode } from 'react';
import useStatistics from '@/app/hooks/useStatistics';

interface BackSideBodyTableProps {
  icon: ReactNode;
  dataArr: number[];
}

const BackSideBodyTable: FC<BackSideBodyTableProps> = ({ icon, dataArr }) => {
  return (
    <tr className='px-4 py-2 text-center'>
      <td>{icon}</td>
      <td>{useStatistics(dataArr).minData}</td>
      <td>{useStatistics(dataArr).avgData}</td>
      <td>{useStatistics(dataArr).maxData}</td>
    </tr>
  );
};

export default BackSideBodyTable;

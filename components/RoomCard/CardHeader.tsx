import _ from 'lodash';
import { FC } from 'react';

import { RiEditLine, RiCloseCircleLine } from 'react-icons/ri';

interface Props {
  id: number;
}

const CardHeader: FC<Props> = ({ id }) => {
  return (
    <>
      <RiEditLine size={20} className='card-button' />
      <p className='text-xl'>Ruang {id + 1}</p>
      <RiCloseCircleLine size={20} className='card-button hover:bg-merah' />
    </>
  );
};

export default CardHeader;

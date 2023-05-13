import _ from 'lodash';
import { FC, useContext } from 'react';

import { RiEditLine, RiCloseCircleLine } from 'react-icons/ri';
import { CardContext } from './RoomCard';

interface Props {
  id: number;
}

const CardHeader: FC<Props> = ({ id }) => {
  const { setDialogTitle, setType } = useContext(CardContext);

  const handleEdit = (e: any) => {
    e.stopPropagation();
    setDialogTitle(`Edit Room ${id + 1} Info`);
    setType('edit');
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    setDialogTitle('Are you sure?');
    setType('delete');
  };

  return (
    <>
      <RiEditLine
        onClick={e => handleEdit(e)}
        size={20}
        className='card-button'
      />
      <p className='text-xl'>Ruang {id + 1}</p>
      <RiCloseCircleLine
        onClick={e => handleDelete(e)}
        size={20}
        className='card-button '
      />
    </>
  );
};

export default CardHeader;

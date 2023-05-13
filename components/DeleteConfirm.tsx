import { dynamicPathRef } from '@/utils/firebase';
import { useDatabaseRemoveMutation } from '@react-query-firebase/database';
import { FC, useContext } from 'react';
import { CardContext } from './RoomCard/RoomCard';

interface DeleteConfirmProps {
  id: number;
}

const DeleteConfirm: FC<DeleteConfirmProps> = ({ id }) => {
  const { setType } = useContext(CardContext);
  const mutation = useDatabaseRemoveMutation(dynamicPathRef(id));

  const handleConfirm = () => {
    mutation.mutate();
    setType(null);
  };

  const handleCancel = () => {
    setType(null);
  };

  return (
    <div className='mt-5 flex flex-col items-center'>
      <p className='my-2 text-justify'>
        Deleting this room card will permanently delete all of Room {id + 1}{' '}
        data. This action cannot be undone.
      </p>
      <div className='flex w-full justify-around py-3'>
        <button
          onClick={handleConfirm}
          className='inline-flex items-center justify-center rounded-lg bg-hijauTerang px-4 py-2 text-sm font-medium text-white duration-150 hover:bg-hijauTerang/70 active:scale-95 '>
          Confirm
        </button>
        <button
          onClick={handleCancel}
          className='inline-flex items-center justify-center rounded-lg bg-merah px-4 py-2 text-sm font-medium text-white duration-150 hover:bg-merah/70 active:scale-95 '>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirm;

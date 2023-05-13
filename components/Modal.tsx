import { FC, Fragment, useContext, useState, useEffect } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { CardContext } from './RoomCard/RoomCard';
import EditForm from './EditForm';
import DeleteConfirm from './DeleteConfirm';
import AddForm from './AddForm';

interface Props {
  dialogTitle: string;
}

const Modal: FC<Props> = ({ dialogTitle }) => {
  const { type, setType, id, setNewName } = useContext(CardContext);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setType(null);
  };

  const autoSelectType = () => {
    if (type !== null) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    autoSelectType();
  }, [type]);

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    setNewName(input);
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'>
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl outline outline-title transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-center text-lg font-medium leading-6 text-title'>
                  {dialogTitle}
                </Dialog.Title>
                {type === 'edit' ? (
                  <EditForm
                    handleOnSubmit={handleOnSubmit}
                    setInput={setInput}
                  />
                ) : type === 'delete' ? (
                  <DeleteConfirm id={id} />
                ) : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
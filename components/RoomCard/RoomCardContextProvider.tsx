import { FC, createContext, useState } from 'react';

interface CardContext {
  type: 'edit' | 'add' | 'delete' | null;
  dialogTitle: string;
  roomNumber: number;
  isFlipped: boolean;
  setDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  setType: React.Dispatch<
    React.SetStateAction<'edit' | 'add' | 'delete' | null>
  >;
}

interface RoomCardContextProviderProps {
  children: React.ReactNode;
  roomNumber: number;
}

export const CardContext = createContext<CardContext>({} as CardContext);

const RoomCardContextProvider: FC<RoomCardContextProviderProps> = ({
  children,
  roomNumber
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [type, setType] = useState<'edit' | 'add' | 'delete' | null>(null);

  const value = {
    type,
    setType,
    roomNumber,
    dialogTitle,
    setDialogTitle,
    isFlipped,
    setIsFlipped
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

export default RoomCardContextProvider;

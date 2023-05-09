import {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState
} from 'react';

interface ContextType {
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
}

export const CardContext = createContext<ContextType>({} as ContextType);

export const CardContextProvider = ({ children }: { children: ReactNode }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const contextValue = {
    isFlipped,
    setIsFlipped
  };

  return (
    <CardContext.Provider value={contextValue}>{children}</CardContext.Provider>
  );
};

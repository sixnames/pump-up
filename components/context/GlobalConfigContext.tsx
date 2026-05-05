'use client';
import { User } from '@/payload-types';
import { createContext, ReactNode, useContext } from 'react';

interface GlobalConfigContextInterface {
  user?: User | null;
}

const GlobalConfigContext = createContext<GlobalConfigContextInterface | null>(null);

interface GlobalConfigContextProviderProps extends GlobalConfigContextInterface {
  children: ReactNode;
}

const GlobalConfigContextProvider = ({ children, user }: GlobalConfigContextProviderProps) => {
  return <GlobalConfigContext.Provider value={{ user }}>{children}</GlobalConfigContext.Provider>;
};

function useGlobalConfigContext() {
  const context = useContext(GlobalConfigContext);
  if (!context) {
    throw new Error('useGlobalConfigContext must be used within a GlobalConfigContext');
  }
  return context;
}

export { GlobalConfigContextProvider, useGlobalConfigContext };

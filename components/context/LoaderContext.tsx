'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { BarLoader } from 'react-spinners';

interface LoaderContextValue {
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextValue | null>(null);

interface LoaderContextProviderProps {
  children: ReactNode;
}

const LoaderContextProvider = ({ children }: LoaderContextProviderProps) => {
  const [show, setShow] = useState(false);

  const showLoader = () => {
    setShow(true);
  };

  const hideLoader = () => {
    setShow(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {show ? (
        <div className={'fixed top-0 left-0 w-screen h-screen z-1000 flex justify-center items-center bg-[rgba(0,0,0,0.15)]'}>
          <BarLoader color={'#e00101'} loading={true} aria-label='Loading Spinner' data-testid='loader' />
        </div>
      ) : null}
    </LoaderContext.Provider>
  );
};

function useLoaderContext() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoaderContext must be used within a LoaderContext');
  }
  return context;
}

export { LoaderContextProvider, useLoaderContext };

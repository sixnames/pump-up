import React from 'react';

interface FilterContainerProps {
  children: React.ReactNode;
}

export default function FilterContainer({ children }: FilterContainerProps) {
  return <div className={'grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 items-end'}>{children}</div>;
}

'use client';

import React, { createContext, useContext, useState } from 'react';

type InputHeightContextType = {
  inputHeight: number;
  setInputHeight: (height: number) => void;
};

const InputHeightContext = createContext<InputHeightContextType | null>(null);

export function InputHeightProvider({ children }: { children: React.ReactNode }) {
  const [inputHeight, setInputHeight] = useState<number>(0);

  return (
    <InputHeightContext.Provider value={{ inputHeight, setInputHeight }}>
      {children}
    </InputHeightContext.Provider>
  );
}

export const useInputHeight = (): InputHeightContextType => {
  const context = useContext(InputHeightContext);
  if (!context) {
    throw new Error('useInputHeight must be used within an InputHeightProvider');
  }
  return context;
};

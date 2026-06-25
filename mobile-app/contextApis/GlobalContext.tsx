import React, { createContext, ReactNode, useContext, useState } from "react";

type SearchContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: SearchProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value: SearchContextType = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useGlobalContext = (): SearchContextType => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }

  return context;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  username: string;
  email: string;
}

interface GlobalContextType {
  loading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Failed to load session", e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newUser: User, newToken: string) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      await AsyncStorage.setItem("token", newToken);
      setUser(newUser);
      setToken(newToken);
      setIsLoggedIn(true);
    } catch (e) {
      console.error("Failed to save login session", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Failed to clear login session", e);
    }
  };

  return (
    <GlobalContext.Provider
      value={{ loading, isLoggedIn, user, token, login, logout }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within GlobalContextProvider",
    );
  }
  return context;
};

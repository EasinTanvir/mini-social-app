import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  username: string;
  email: string;
};

type SearchContextType = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type SearchProviderProps = {
  children: ReactNode;
};

export const GlobalContextProvider = ({ children }: SearchProviderProps) => {
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (user: User, token: string) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("token", token);

    setUser(user);
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeMany(["user", "token"]);

    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <SearchContext.Provider
      value={{
        loading,
        isLoggedIn,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useGlobalContext must be used within GlobalContextProvider",
    );
  }

  return context;
};

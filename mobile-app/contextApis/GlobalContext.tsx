import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import registerForPushNotifications from "../utils/notifications";
import { Alert } from "react-native";

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
  usernameFilter: string | undefined;
  setUsernameFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
  feedRefreshKey: number;
  setFeedRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  triggerFeedRefresh: () => void;
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
  const [usernameFilter, setUsernameFilter] = useState<string | undefined>();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

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

  useEffect(() => {
    if (token) {
      registerForPushNotifications(token);
    }
  }, [token]);

  const triggerFeedRefresh = useCallback(() => {
    setFeedRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { title, body } = notification.request.content;
        console.log("Notification received:", notification.request.content);

        Alert.alert(title ?? "New Notification", body ?? "");

        triggerFeedRefresh();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const postId = data?.postId as string | undefined;
        if (postId) {
          console.log("User tapped notification for postId:", postId);

          triggerFeedRefresh();
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [triggerFeedRefresh]);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        isLoggedIn,
        user,
        token,
        login,
        logout,
        usernameFilter,
        setUsernameFilter,
        feedRefreshKey,
        setFeedRefreshKey,
        triggerFeedRefresh,
      }}
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

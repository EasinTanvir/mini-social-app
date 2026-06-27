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

interface User {
  id: string;
  username: string;
  email: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "like" | "comment" | "other";
  receivedAt: number;
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
  notifications: AppNotification[];
  unreadCount: number;
  clearNotifications: () => void;
  feedRefreshKey: number;
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
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const unreadCount = notifications.length;

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const triggerFeedRefresh = useCallback(() => {
    setFeedRefreshKey((k) => k + 1);
  }, []);

  const addNotification = useCallback((title: string, body: string) => {
    const type = title.toLowerCase().includes("like")
      ? "like"
      : title.toLowerCase().includes("comment")
        ? "comment"
        : "other";

    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      body,
      type,
      receivedAt: Date.now(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

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
      setNotifications([]);
    } catch (e) {
      console.error("Failed to clear login session", e);
    }
  };

  useEffect(() => {
    if (token) {
      registerForPushNotifications(token);
    }
  }, [token]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const { title, body } = notification.request.content;
        const t = title ?? "New Notification";
        const b = body ?? "";

        addNotification(t, b);
        //Alert.alert(t, b);
        //triggerFeedRefresh();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const postId = data?.postId as string | undefined;
        if (postId) {
          console.log("User tapped notification for postId:", postId);
          //triggerFeedRefresh();
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [addNotification, triggerFeedRefresh]);

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
        notifications,
        unreadCount,
        clearNotifications,
        feedRefreshKey,
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

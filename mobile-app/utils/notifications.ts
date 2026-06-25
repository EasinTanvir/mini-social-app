import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import api from "@/services/api";

Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

const registerForPushNotifications = async (
  token: string,
): Promise<string | null> => {
  if (!Device.isDevice) {
    console.warn("Push notifications only work on physical devices");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Push notification permission denied");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2563EB",
      sound: "default",
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? "speedy-precinct-465516-g2";

  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  const fcmToken = expoPushToken.data;

  try {
    await api.post(
      "/auth/fcm-token",
      { fcmToken },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    console.log("FCM token saved to backend");
  } catch (e) {
    console.error("Failed to save FCM token:", e);
  }

  return fcmToken;
};

export default registerForPushNotifications;

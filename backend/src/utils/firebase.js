const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { messaging } = require("firebase-admin");

const apps = getApps();
if (!apps || !apps.length) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.error(
      "Missing Firebase env variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY",
    );
    process.exit(1);
  }

  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const sendFCMNotification = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) return;

  try {
    const stringifiedData = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)]),
    );

    await messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: stringifiedData,
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "default",
        },
      },
    });
    console.log("FCM sent:", title);
  } catch (error) {
    if (
      error.code === "messaging/registration-token-not-registered" ||
      error.code === "messaging/invalid-registration-token"
    ) {
      console.warn("Invalid FCM token, should clear from DB");
    } else {
      console.error("FCM error:", error.message);
    }
  }
};

module.exports = { sendFCMNotification };

const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sendFCMNotification = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) return;

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data,
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
    // Token expired or invalid — clear it from DB
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

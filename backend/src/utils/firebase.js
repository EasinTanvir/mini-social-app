// In v14, everything for initialization is cleanly imported from 'firebase-admin/app'
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { messaging } = require("firebase-admin");

let serviceAccount;
try {
  serviceAccount = require("../../firebase-service-account.json");
} catch (e) {
  console.error("firebase-service-account.json not found:", e.message);
  process.exit(1);
}

// Check initialized state using standard getApps()
const apps = getApps();
if (!apps || !apps.length) {
  initializeApp({
    // Fix: Pass your service account directly into the standalone cert() function
    credential: cert(serviceAccount),
  });
}

const sendFCMNotification = async (fcmToken, { title, body, data = {} }) => {
  if (!fcmToken) return;

  try {
    await messaging().send({
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

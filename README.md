# Mini Social Feed App

A lightweight social media app built with Node.js + Express (backend) and React Native + Expo (mobile).

## Project Structure

```
├── backend/        # Node.js + Express + MongoDB (Prisma ORM) + Firebase Admin
├── mobile-app/     # React Native + Expo
└── README.md
```

## Links

- **APK Download:** https://expo.dev/accounts/easin/projects/mobile-app/builds/f7ecf21b-f38f-4760-99fa-b6c5cd8e2f0c
- **GitHub:** https://github.com/EasinTanvir/mini-social-app

---

## Backend Setup

### Requirements

- Node.js 20+
- MongoDB Atlas connection string

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

### Step 2 — Create environment file

Create a `.env` file inside the `backend/` folder:

```bash
cp .env.example .env
```

Then fill in your values:

| Variable          | Description                     |
| ----------------- | ------------------------------- |
| `PORT`            | Server port (e.g. `5001`)       |
| `FRONTEND_ORIGIN` | Allowed CORS origin             |
| `DATABASE_URL`    | MongoDB Atlas connection string |
| `TOKEN_KEY`       | JWT secret key                  |

### Step 3 — Generate Prisma client

```bash
npx prisma generate
```

### Step 4 — Start the server

```bash
npm run dev
```

Server will run at `http://localhost:<PORT>/api/v1`

## keep the backend running

## API Endpoints

All endpoints except signup/login require: `Authorization: Bearer <token>`

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| POST   | `/auth/signup`                    | Register `{ username, email, password }` |
| POST   | `/auth/login`                     | Login `{ email, password }`              |
| POST   | `/auth/fcm-token`                 | Save device FCM token `{ fcmToken }`     |
| GET    | `/post?page=1&limit=10&username=` | Get paginated posts (newest first)       |
| POST   | `/post`                           | Create post `{ text }`                   |
| POST   | `/post/:id/like`                  | Toggle like on a post                    |
| POST   | `/post/:id/comment`               | Add comment `{ text }`                   |

---

## Testing the Mobile App (Without Notifications)

The provided APK works fully for all features

### Step 1 — Create environment file

Create a `.env` file inside the `mobile-app/` folder:

```bash
cd mobile-app
cp .env.example .env
```

Then set your backend address:

```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:<BACKEND_PORT>/api/v1
```

> Use your machine's LAN IP (e.g. `192.168.1.5`), not `localhost` — the device cannot reach `localhost` over the network.

### Step 2 — Start the app server

```bash
npx expo start --dev-client
```

App will run at `http://<YOUR_LOCAL_IP>:<8081>/api/v1`

### Step 3 — Install the APK

Download and install the APK on your Android device from the link above.

### Step 4 — Open the app

Open the app on your Android device or tablet and it will connect to your backend automatically.

> ⚠️ Push notifications will not work with the provided APK because the APK is tied to a private Firebase project. To enable notifications, follow the steps below.

---

## Enable Push Notifications (Requires Rebuild)

Since Firebase credentials cannot be shared publicly, you need to set up your own Firebase project and rebuild the APK.

### Step 1 — Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add project** and complete the setup
3. Inside the project, click the **Android icon** to register an Android app
4. Use this exact package name: **`com.easintanvir.mobileapp`**
5. Complete the registration

### Step 2 — Get `google-services.json`

1. In Firebase Console → Project Settings → General → Your Android apps
2. Download `google-services.json`
3. Place it in **`mobile-app/`** root (same level as `app.json`)

### Step 3 — Get `firebase-service-account.json`

1. In Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key** → download the JSON file
3. Rename the file to exactly **`firebase-service-account.json`**
4. Place it in **`backend/`** root (same level as `package.json`)

### Step 4 — Start the backend

```bash
cd backend
npm run dev
```

### Step 5 — Set up mobile environment

Create `mobile-app/.env` if not already done:

```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:<BACKEND_PORT>/api/v1
```

### Step 6 — Rebuild the APK

```bash
cd mobile-app
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Step 7 — Install and test

1. Download the newly built APK from the EAS dashboard
2. Install it on your Android device
3. Login — the app will request notification permission automatically
4. From a second account, like or comment on the first user's post
5. The first device will receive a push notification

---

## Push Notification Behavior

- Triggered when someone **likes** your post → "New Like ❤️"
- Triggered when someone **comments** on your post → "New Comment 💬"
- You do **not** get notified for your own actions

# Mini Social Feed App

## Project Structure

```
├── backend/        # Node.js + Express + MongoDB (Prisma ORM) + Firebase Admin
├── mobile-app/     # React Native + Expo
└── README.md
```

## Links

- **APK Download:** https://drive.google.com/file/d/1e_ONneXOiCgj6DdIqZJVabZUuLbg-AhJ/view?usp=drive_link
- **GitHub:** https://github.com/EasinTanvir/mini-social-app
- **Backend Base URL:** https://mini-social-app-cvs0.onrender.com/api/v1

> **Note:** The backend is hosted on a free tier (Render). The first request may take 10–20 seconds while the server wakes from sleep. Subsequent requests will be fast.

## Try the App (No Setup Required)

Download the APK from the Google Drive link above and install it on your Android device or tablet.

> Since this APK is distributed outside the Play Store, Android may show a warning — tap **"Install anyway"** to proceed.

Once installed:

1. Open the app and create an account with your email, password, and username
2. Log in — you will land on the news feed
3. **Allow notifications** when prompted to receive push notifications
4. Browse the feed, create posts, like and comment on others' posts
5. When someone likes or comments on your post, you will receive a push notification
6. A badge on the Notifications tab shows the number of unread notifications — tap it to see all notifications

The app is already connected to a live production backend. No local setup is needed.

---

## API Endpoints

Base URL: `https://mini-social-app-cvs0.onrender.com/api/v1`

All endpoints except signup and login require: `Authorization: Bearer <token>`

| Method | Endpoint                           | Description                              |
| ------ | ---------------------------------- | ---------------------------------------- |
| POST   | `/auth/signup`                     | Register `{ username, email, password }` |
| POST   | `/auth/login`                      | Login `{ email, password }`              |
| POST   | `/auth/fcm-token`                  | Save device FCM token `{ fcmToken }`     |
| GET    | `/posts?page=1&limit=10&username=` | Get paginated posts (newest first)       |
| POST   | `/posts`                           | Create post `{ text }`                   |
| POST   | `/posts/:id/like`                  | Toggle like on a post                    |
| POST   | `/posts/:id/comment`               | Add comment `{ text }`                   |

---

## Backend Setup (Manual)

Entry point: `server.js`

### Step 1 — Create environment file

Create a `.env` file inside the `backend/` folder:

```env
PORT=
TOKEN_KEY=
DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

To get the Firebase values, go to Firebase Console → Project Settings → Service Accounts → Generate new private key. Open the downloaded JSON and copy:

| Env Variable            | Key in JSON                     |
| ----------------------- | ------------------------------- |
| `FIREBASE_PROJECT_ID`   | `project_id`                    |
| `FIREBASE_CLIENT_EMAIL` | `client_email`                  |
| `FIREBASE_PRIVATE_KEY`  | `private_key` (keep the quotes) |

### Step 2 — Install dependencies

```bash
cd backend
npm install
```

### Step 3 — Start the server

```bash
npm start
```

Server runs at `http://localhost:<PORT>/api/v1`

---

## Mobile App — Run from Source (Optional)

The APK is already built and ready. If you want to run from source:

```bash
cd mobile-app
npm install
```

Create a `.env` file inside `mobile-app/`:

```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:<BACKEND_PORT>/api/v1
```

> Use your machine's LAN IP (e.g. `192.168.1.5`), not `localhost` — the device cannot reach `localhost` over the network.

Then start:

```bash
npx expo start
```

> **Note for rebuilding the APK:** Place a `google-services.json` file in the `mobile-app/` root directory. The file must be registered with Android package name `com.easintanvir.mobileapp` (Firebase Console → Project Settings → General → Add Android app). Then run `eas build --platform android --profile preview`.

Note

There is a keyboard overlapping issue in the APK provided when opening the comment modal and focusing on the input field.

This issue has already been fixed in the latest source code included in this repository. Unfortunately, I was unable to generate a new APK because I had already reached the 15 build limit of the free Expo EAS plan.

I sincerely apologize for this inconvenience. Aside from this APK-specific issue, all core functionalities including authentication, posting, likes, comments, feed filtering, and Firebase push notifications—are fully implemented and working correctly.

Thank you for taking the time to review my submission.

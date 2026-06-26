# Mini Social Feed App

## Project Structure

```
├── backend/        # Node.js + Express + MongoDB (Prisma ORM) + Firebase Admin
├── mobile-app/     # React Native + Expo
└── README.md
```

---

## Backend Setup

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

### Step 2 — Create environment file

Create a `.env` file inside the `backend/` folder and fill in your values:

```env
PORT=
FRONTEND_ORIGIN=
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

### Step 3 — Start the server

```bash
npm start
```

Server runs at `http://localhost:<PORT>/api/v1`

---

## API Endpoints

All endpoints except signup and login require: `Authorization: Bearer <token>`

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

## Mobile App

The APK is ready to install — no build step needed.

1. Download and install the APK from the link
2. Open the app on your Android device or tablet
3. The app is already connected to a live backend — no local setup required

### Run from source (optional)

If you want to run the app manually instead of using the APK:

```bash
cd mobile-app
npm install
```

Create a `.env` file inside `mobile-app/`:

```env
# Use your machine's LAN IP, not localhost
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:<BACKEND_PORT>/api/v1
```

Then start:

```bash
npx expo start
```

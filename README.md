## Project Structure

```
├── backend/        # Node.js + Express + MongoDB + Firebase Admin
├── mobile-app/     # React Native + Expo
└── README.md
```

## Links

- **APK Download:** https://expo.dev/accounts/easin/projects/mobile-app/builds/f7ecf21b-f38f-4760-99fa-b6c5cd8e2f0c
- **GitHub:** https://github.com/EasinTanvir/mini-social-app

## Backend Setup

### Requirements

- Node.js 20+
- MongoDB Atlas connection string
- `firebase-service-account.json` placed in the `backend/` root (from Firebase Console → Project Settings → Service Accounts → Generate new private key)

### Steps

```bash
cd backend
npm install
cp .env.example .env   # fill in the values
npx prisma generate
npm run dev
```

### Environment Variables

| Variable          | Description                     |
| ----------------- | ------------------------------- |
| `PORT`            | Server port (e.g. `5001`)       |
| `FRONTEND_ORIGIN` | Allowed CORS origin             |
| `DATABASE_URL`    | MongoDB Atlas connection string |
| `TOKEN_KEY`       | JWT secret key                  |

### API Endpoints

Base URL: `http://localhost:5001/api/v1`

All endpoints except signup/login require: `Authorization: Bearer <token>`

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| POST   | `/auth/signup`                    | Register `{ username, email, password }` |
| POST   | `/auth/login`                     | Login `{ email, password }`              |
| POST   | `/auth/fcm-token`                 | Save device FCM token `{ fcmToken }`     |
| GET    | `/post?page=1&limit=10&username=` | Get paginated posts                      |
| POST   | `/post`                           | Create post `{ text }`                   |
| POST   | `/post/:id/like`                  | Toggle like                              |
| POST   | `/post/:id/comment`               | Add comment `{ text }`                   |

---

## Mobile App Setup

### Requirements

- Node.js 20+
- Physical Android device or Google Play emulator (required for push notifications)

### Steps

```bash
cd mobile-app
npm install
cp .env.example .env   # set your backend IP
npx expo start
```

### Environment Variables

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | Backend URL e.g. `http://192.168.1.5:5001/api/v1` |

> Use your machine's local IP address, not `localhost`, so the device can reach the backend.

---

## Push Notifications

Notifications are sent via Firebase Cloud Messaging when someone likes or comments on your post.

- `firebase-service-account.json` file must be present in `backend/` (not committed to Git)
- `google-services.json` file must be present in `mobile-app/` (not committed to Git)
- The APK above already has FCM integrated and ready to use

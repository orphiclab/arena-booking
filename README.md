# Arena Booking – Sports Platform

A full-featured **React Native (Expo)** mobile app for discovering and booking sports arenas, with a **Firebase** backend.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** ≥ 18 installed
- **Expo CLI** installed globally: `npm install -g expo-cli`
- A **Firebase project** (free Spark plan works for development)
- (Optional) A **Google Maps API key**

### 2. Install dependencies
```bash
cd /Users/avi/.gemini/antigravity/scratch/arena-booking
npm install
```

### 3. Configure Firebase
Open `src/config/firebase.js` and replace the placeholder values:
```js
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```
Get these from: **Firebase Console → Project Settings → Your Apps → Web App**

### 4. Enable Firebase services
In Firebase Console, enable:
- ✅ Authentication → Email/Password (+ Phone if needed)
- ✅ Firestore Database (start in test mode, then apply rules)
- ✅ Storage
- ✅ Cloud Messaging (for push notifications)

### 5. Deploy Firestore & Storage rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage   # Select your project
# Copy firestore.rules and storage.rules from this project
firebase deploy --only firestore:rules,storage:rules
```

### 6. (Optional) Google Maps API Key
In `app.json`, replace `YOUR_GOOGLE_MAPS_API_KEY` under `android.config.googleMaps.apiKey`.

### 7. Add required assets
Create placeholder assets in `assets/` folder:
```bash
mkdir -p assets
# Add: icon.png (1024×1024), splash.png (1242×2436), adaptive-icon.png (1024×1024)
# favicon.png is optional for web
```

### 8. Run the app
```bash
npx expo start
```
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with **Expo Go** app on your phone

---

## 📁 Project Structure

```
arena-booking/
├── App.js                          # Entry point
├── app.json                        # Expo config
├── package.json
├── babel.config.js
├── firestore.rules                 # Firestore security rules
├── storage.rules                   # Storage security rules
└── src/
    ├── config/
    │   └── firebase.js             # ⚠️ ADD YOUR CREDENTIALS HERE
    ├── contexts/
    │   └── AuthContext.js          # Global auth state
    ├── navigation/
    │   ├── AppNavigator.js         # Root router (auth/customer/owner/admin)
    │   ├── AuthStack.js            # Splash → Login → Signup → OTP
    │   ├── CustomerTabs.js         # Home, Bookings, Events, Profile
    │   ├── OwnerTabs.js            # Dashboard, Profile
    │   └── AdminTabs.js            # Admin dashboard + all sub-screens
    ├── screens/
    │   │── Auth
    │   │   ├── SplashScreen.js
    │   │   ├── LoginScreen.js
    │   │   ├── SignupScreen.js
    │   │   └── OTPScreen.js
    │   ├── Customer
    │   │   ├── HomeScreen.js       # Map + List + filters
    │   │   ├── ArenaDetailScreen.js
    │   │   ├── CourtSelectionScreen.js  # Sport → Court picker
    │   │   ├── BookingScreen.js    # Calendar + time slots
    │   │   ├── MyBookingsScreen.js # Upcoming / History
    │   │   ├── EventsScreen.js
    │   │   └── ProfileScreen.js
    │   ├── Owner
    │   │   ├── OwnerDashboardScreen.js
    │   │   ├── AddEditArenaScreen.js
    │   │   └── ArenaBookingsScreen.js
    │   └── Admin
    │       ├── AdminDashboardScreen.js
    │       ├── AdminArenasScreen.js
    │       ├── AdminUsersScreen.js
    │       ├── AdminBookingsScreen.js
    │       └── AdminEventsScreen.js
    ├── services/
    │   ├── authService.js
    │   ├── arenaService.js
    │   ├── bookingService.js       # Firestore transaction (no double-booking)
    │   ├── courtService.js
    │   ├── eventService.js
    │   ├── paymentService.js       # Stripe placeholder + pay-at-venue
    │   ├── storageService.js
    │   └── notificationService.js
    ├── components/
    │   ├── ArenaCard.js
    │   ├── BookingCard.js
    │   ├── CourtCard.js
    │   ├── CustomButton.js
    │   ├── CustomInput.js
    │   ├── EventCard.js
    │   ├── ImageCarousel.js
    │   ├── PaymentMethodSelector.js
    │   ├── SportSelector.js
    │   ├── StarRating.js
    │   └── TimeSlotPicker.js
    ├── hooks/
    │   └── useLocation.js          # GPS + Haversine distance
    ├── utils/
    │   └── dateUtils.js            # Slot generation, date formatting
    └── theme/
        ├── colors.js               # Dark/Light palettes
        └── typography.js
```

---

## 🗄️ Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | userId, name, email, phone, role (customer/owner/admin), profileImage, expoPushToken |
| `arenas` | arenaId, ownerId, name, location, lat, lng, images, sports[], pricePerHour, availability |
| `courts` | courtId, arenaId, sportId, name, pricePerHour, openingTime, closingTime, isActive |
| `bookings` | bookingId, userId, arenaId, courtId, date, startTime, endTime, totalPrice, paymentMethod, bookingStatus |
| `payments` | paymentId, bookingId, userId, amount, paymentMethod, paymentStatus, transactionId |
| `events` | eventId, title, description, eventDate, arenaId, arenaName, image, publishedBy |
| `sports` | sportId, name, icon (for admin-managed sport catalogue) |

---

## 👥 User Roles

| Role | Access |
|---|---|
| `customer` | Discover arenas, book courts, view/cancel bookings, see events |
| `owner` | Add/edit/delete own arenas, view bookings for their arenas |
| `admin` | Full platform access: all arenas, all users, all bookings, publish events |

> **To make a user an admin**: Manually set `role: 'admin'` in Firestore for that user's document.

---

## 💳 Payment Integration

Two methods are implemented:

1. **Pay at Venue** – Works out of the box. Booking confirmed immediately.
2. **Online Card (Stripe)** – Requires a Firebase Cloud Function:
   - Deploy a Cloud Function that creates a Stripe `PaymentIntent`
   - Update the `initiateStripePayment` placeholder in `src/services/paymentService.js`
   - Use `@stripe/stripe-react-native` package for the payment sheet

---

## 📱 OTP / Phone Authentication

For production phone OTP:
1. Enable **Phone** in Firebase Authentication → Sign-in methods
2. Replace the placeholder in `OTPScreen.js` with `@react-native-firebase/auth` native phone auth
3. **For testing**: Add test phone numbers in Firebase Console → Authentication → Phone → Test phone numbers (e.g. `+91 9999900000` → OTP: `123456`)

---

## 🔔 Push Notifications

- Uses Expo Notifications + Firebase Cloud Messaging
- Push tokens stored in `users/{uid}.expoPushToken`
- Send targeted notifications via Firebase Cloud Functions using the Expo Push API
- Local scheduling (booking reminders) works in Expo Go on physical devices

---

## 🔒 Security

- Firestore rules enforce role-based access on all collections
- Storage rules enforce file type (images only) and size limits (10MB arenas, 5MB profiles)
- Double-booking is prevented by a **Firestore transaction** in `bookingService.js`
- Suspended users are flagged in Firestore (implement auth token revocation for full lockout)

---

## 🛣️ Roadmap / Future Phases

- [ ] Stripe payment UI integration
- [ ] Arena owner onboarding + admin approval flow
- [ ] Court-level real-time availability (Firestore listeners)
- [ ] Review & rating system
- [ ] Landing website (Next.js) with event announcements
- [ ] Multi-vendor marketplace with revenue split

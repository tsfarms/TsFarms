# TS Mango Farming

Farm website: customers search products, build a cart, and send the order on WhatsApp.
An admin panel at `/admin` manages products, orders and enquiries through Firebase.

## Folder structure

```
src/
  main.tsx                 React entry
  App.tsx                  Routes (public home + lazy-loaded admin)
  theme.ts                 MUI theme
  content/site.ts          Products, prices, images, contact numbers
  components/
    layout/                Navbar, Footer, Preloader, floating buttons, shared bits
    sections/              Homepage sections (Hero, Order, Farm, Gallery, ...)
  features/
    cart/                  Cart state, order sheet, WhatsApp message builder
  hooks/                   Shared UI hooks
  pages/
    HomePage.tsx
    admin/                 Admin screens (need Firebase + login)
  services/
    firebase/
      config.ts            Reads VITE_FIREBASE_* env vars
      client.ts            app, auth, db, functions instances
      firestore.ts         All Firestore reads/writes
      index.ts             Import everything from '@/services/firebase'
functions/                 Cloud Functions (WhatsApp webhook, delivery confirmation)
firebase.json              Hosting + Firestore config
firestore.rules            Security rules
```

All backend access goes through `@/services/firebase`. The public homepage does not import it, so the Firebase SDK only loads on `/admin`.

## Run locally

```
npm install
npm run dev
```

The shop and WhatsApp ordering work without Firebase.

## Connect Firebase

1. Firebase Console > Project settings > Your apps > add a Web app.
2. Copy `.env.example` to `.env.local` and paste the config values.
3. Enable Authentication > Email/Password and create an admin user.
4. Restart `npm run dev`, then sign in at `/admin/login`.

## Deploy

```
npm run build
npx firebase deploy --only hosting,firestore:rules
```

Cloud Functions: `cd functions && npm install && npm run build && npx firebase deploy --only functions`.

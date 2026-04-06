# Shongkhep App

Expo React Native prototype for a premium dark news-summary app with:

- Reels-style vertical news feed
- Swipe left to open the original article inside the app
- Swipe right to open a sidebar with filters and utility links
- Separate English and Bangla endpoint selection
- Dummy bilingual content for fast UI iteration

## Run locally

```bash
npm install
```

If you are using Expo Go on a real device, point the app to your backend using your Mac's LAN IP before starting Expo:

```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.176:8000/api/v1 npm start
```

## Backend

A scalable FastAPI backend now lives in [shongkhep-backend/README.md](/Users/mustakimahmedhasan/Workspace/Startups/Shongkhep/shongkhep-backend/README.md).

## Product notes

- For premium feel, avoid clutter and keep only one primary action visible per card.
- In production, prefer opening source pages in an in-app webview with reader mode controls.
- Cache feeds aggressively so refresh feels instant.
# shongkhep-app

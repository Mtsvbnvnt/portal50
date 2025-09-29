# Portal 50+

## Deployment Instructions

This project is configured for Vercel deployment.

### Build Configuration:
- **Root Directory:** `/`
- **Build Command:** `npm run build`
- **Output Directory:** `Frontend_Portal50/dist`
- **Install Command:** `npm install`

### Environment Variables Required:
```
VITE_FIREBASE_API_KEY=AIzaSyCR_lQcycAQIM4cq9CfDbu4Sfhe12wNMGc
VITE_FIREBASE_AUTH_DOMAIN=portal50-81af7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portal50-81af7
VITE_FIREBASE_STORAGE_BUCKET=portal50-81af7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=115968238719
VITE_FIREBASE_APP_ID=1:115968238719:web:328aa3db9839a869f84b4a
VITE_FIREBASE_MEASUREMENT_ID=G-WJSJNFDSFQ
VITE_API_URL=http://localhost:3000
```

### Project Structure:
- `Frontend_Portal50/` - React + Vite application
- `Backend_Portal50/` - Node.js + Express API
- `vercel.json` - Vercel configuration
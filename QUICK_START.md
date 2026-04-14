# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Configure Firebase

1. Go to https://console.firebase.google.com
2. Create a new project or use an existing one
3. Copy your Firebase config from Project Settings
4. Open `src/main.js` and replace the `firebaseConfig` object with your actual values

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or similar port shown in terminal)

### Step 4: Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

---

## 📱 Test on Your Phone

### Method 1: Local Network
```bash
npm run dev
# See the server URL (e.g., http://192.168.x.x:5173)
# Open this URL on your phone (same WiFi network)
```

### Method 2: Deploy Then Access
- Deploy to Firebase Hosting, Vercel, or Netlify
- Open the deployed URL on your phone

---

## 🎨 Key Features to Try

1. **Login**: Click "Continue with Google"
2. **Add Class**: Click the blue + button
3. **Mark Attendance**: Click Present/Absent buttons
4. **View History**: Click the History button
5. **Backdate**: Click Backdate to add past attendance
6. **Analytics**: Click the chart icon for statistics

---

## 🔧 Customization

### Change Colors
Edit variables in `src/style.css` (around line 1-30):
```css
:root {
  --primary: #3366ff;        /* Main blue */
  --success: #2ecc71;        /* Success green */
  --danger: #e74c3c;         /* Error red */
  /* ... more colors */
}
```

### Change App Name
- Update `<title>` in `index.html`
- Update "name" in `manifest.json`
- Update .logo text in `.login-panel`

### Change Logo Icon
- Update the icon class in `index.html` (line ~30)
- Use Remixicon icons: https://remixicon.com

---

## ⚠️ Important Notes

1. **Firebase Config**: Don't expose your real credentials in production. Use environment variables.
2. **Security Rules**: Make sure to set up Firestore security rules properly
3. **Google OAuth**: Configure consent screen in Google Cloud Console
4. **Domain Whitelisting**: Add your domain to Firebase authorized domains

---

## 🆘 Still Having Issues?

Check the main README.md for troubleshooting and detailed documentation.

---

Need help? Check out:
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite Docs](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

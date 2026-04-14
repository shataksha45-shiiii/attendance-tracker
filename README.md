# Journal - Attendance Tracker

A modern, mobile-responsive attendance tracking application built with vanilla JavaScript, Firebase, and a beautiful glass-morphism UI.

## 🎨 Features

### Core Functionality (Preserved)
- ✅ **Google Authentication** - Secure login with Google
- ✅ **Subject Management** - Add, view, and delete subjects/classes
- ✅ **Attendance Tracking** - Mark attendance as present or absent
- ✅ **History View** - View complete attendance history with filters
- ✅ **Backdate Attendance** - Log past attendance with a calendar picker
- ✅ **Analytics Dashboard** - View statistics and attendance percentages
- ✅ **Progressive Web App** - Works offline with service worker

### 🎯 New UI/UX Improvements

#### Design System
- **Modern Glass-Morphism UI** - Frosted glass effect with backdrop blur
- **Gradient Accents** - Beautiful gradient text and backgrounds
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Color Palette**
  - Primary: `#3366ff` (Modern Blue)
  - Success: `#2ecc71` (Success Green)
  - Danger: `#e74c3c` (Alert Red)
  - Backgrounds: Clean white with subtle gradients

#### Improved Layout
- **Sidebar Navigation** - Vertical navigation bar for easy access
- **Header with Context** - Current date, welcome message, and user info
- **Card-Based Design** - Subject cards with statistics and actions
- **Grid Responsive** - Auto-fill grid that adapts to screen size

#### Mobile Optimization
- **Mobile-First Design** - Optimized for all screen sizes
- **Responsive Breakpoints**:
  - `768px` - Tablet view adjustments
  - `480px` - Mobile view optimizations
- **Touch-Friendly Controls** - Minimum 44px touch targets
- **Flexible Layout** - Sidebar adapts width on mobile
- **Safe Area Support** - iPhone notch compatibility

#### Interactive Elements
- **Subject Cards** with:
  - Live statistics (Classes, Present, Attendance %)
  - Progress bar visualization
  - Quick action buttons for attendance
  - History and backdate options
  - Delete button for management

- **Modals** for:
  - Adding new subjects
  - Viewing attendance history with filters
  - Backdating attendance with calendar

- **Analytics View** with:
  - Per-subject attendance overview
  - Overall progress bars
  - Present/Absent statistics
  - Visual data representation

## 🚀 Getting Started

### Prerequisites
- Node.js (for development)
- Firebase account (for authentication and database)
- Modern web browser or mobile device

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd attendance-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
Update the Firebase configuration in `src/main.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 📂 Project Structure

```
attendance-tracker/
├── index.html          # Main HTML file (modern structure)
├── src/
│   ├── style.css       # Complete responsive styling
│   └── main.js         # All application logic
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
└── package.json       # Dependencies
```

## 🎨 UI Components

### Buttons
- `.apple-btn` - Primary action button with shadow
- `.apple-btn-small` - Smaller primary button
- `.btn-action` - Action buttons (present, absent, history, delete)
- `.text-btn` - Ghost button with transparent background
- `.icon-btn-large` - Large circular icon button
- `.icon-btn-ghost` - Small ghost icon button

### Cards
- `.subject-card` - Card for displaying subject info
- `.analytics-card` - Card for analytics display

### Forms
- Input fields with focus states and borders
- Calendar picker for backdate selection
- Filter buttons for history view

## 📱 Responsive Design

### Desktop (1024px+)
- 3+ column grid for subject cards
- Full sidebar navigation
- Full header with all info displayed

### Tablet (768px - 1023px)
- 2-column grid
- Adjusted header layout
- Responsive sidebar width

### Mobile (480px - 767px)
- Single column grid
- Compact sidebar
- Touch-optimized buttons
- Simplified header

### Small Mobile (<480px)
- Full-width cards
- Minimal spacing
- Accessible touch targets

## 🔐 Security

- Firebase authentication for secure login
- User data isolated per account
- No data stored in browser except cache
- HTTPS required for Firebase

## ⚡ Performance

- Service worker for offline functionality
- Lazy loading of Firebase
- Optimized images and icons (Remixicon)
- CSS transitions for smooth animations
- Efficient DOM updates

## 🛠 Technologies Used

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS 3 with Grid and Flexbox
- **Backend**: Firebase Firestore
- **Auth**: Firebase Authentication (Google)
- **Icons**: Remixicon
- **Calendar**: Flatpickr
- **Fonts**: Google Fonts (Inter)
- **Build**: Vite

## 📞 Support

For issues or feature requests, please open an issue in the repository.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Version**: 2.0 (Redesigned UI with Mobile Support)
2. Execute `npm install` to load dependencies.
3. Execute `npm run dev` to initialize the local development server.

## License

MIT

# ExpenseTrack 💸

ExpenseTrack is a modern full-stack expense tracking web application that helps users manage daily expenses, track monthly budgets, and analyze spending patterns with real-time cloud sync.

Built using React, Firebase, Firestore, Tailwind CSS, and Framer Motion, the app provides a responsive and mobile-friendly finance dashboard with analytics, calendar tracking, filters, and secure authentication.

---

# 🚀 Features

## 🔐 Authentication
- Email & Password Signup/Login
- Remember Me functionality
- Protected Routes
- Persistent Authentication
- Secure Firebase Authentication

## 💰 Expense Management
- Add Expenses
- Edit Expenses
- Delete Expenses
- Category-based expense tracking
- Date-wise expense management
- Monthly expense filtering

## 📊 Analytics Dashboard
- Pie Chart Analytics
- Top Spending Category
- Daily Average Spending
- Monthly Budget Tracking
- Budget Progress Bar
- Remaining Budget Calculation

## 📅 Calendar Tracking
- Monthly Calendar View
- Daily Expense Filtering
- Expense Indicators on Calendar
- Previous Month Expense Support

## 🔍 Search & Filters
- Search by Notes
- Category Filters
- Date Filtering
- Grouped Expenses by Date

## 📱 Responsive UI
- Mobile-Friendly Design
- Responsive Dashboard Layout
- Modern UI with Tailwind CSS
- Smooth Framer Motion Animations

## ☁️ Cloud Features
- Firebase Firestore Database
- Real-time Expense Sync
- Secure Cloud Storage

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS

## Backend & Database
- Firebase Authentication
- Firebase Firestore

## Charts & Analytics
- Recharts

## Calendar
- React Calendar

## Animations
- Framer Motion

## Deployment
- Vercel

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/ExpenseTrack.git
```

---

## 2️⃣ Navigate Into Project

```bash
cd ExpenseTrack
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Setup Firebase

Create a Firebase project from:

https://console.firebase.google.com/

Enable:
- Firebase Authentication
- Firestore Database

---

## 5️⃣ Create `.env`

Create a `.env` file in root folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 6️⃣ Run Development Server

```bash
npm run dev
```

---

# 🔒 Firestore Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {

      allow read, write:
      if request.auth != null
      && request.auth.uid == userId;
    }

    match /expenses/{expenseId} {

      allow create:
      if request.auth != null
      && request.auth.uid ==
      request.resource.data.userId;

      allow read, update, delete:
      if request.auth != null
      && request.auth.uid ==
      resource.data.userId;
    }
  }
}
```

---

# 🌐 Deployment

The app is deployed using Vercel.

---

# 🎯 Future Improvements

- PWA Support
- Monthly Comparison Graphs
- Export Reports (PDF/Excel)
- Dark/Light Theme

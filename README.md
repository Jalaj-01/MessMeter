# MessMeter

**MessMeter** is a modern, real-time digital mess feedback and meal attendance tracking application. Designed as a mobile-friendly progressive web application (PWA) with native Android packaging, it bridges the gap between campus diners (students/staff) and catering management to improve food quality and minimize meal wastage.

---

## 🚀 Features

### 👤 Student Dashboard
* **Meal Attendance Tracking:** Quick options to mark attendance ("Eating" or "Skipping") for upcoming meals.
* **Interactive Menu:** View daily/weekly schedules categorized by Breakfast, Lunch, Dinner, and Night Canteen.
* **Dish-Level Ratings:** Rate individual items in the meal on a visual scale to provide precise feedback.
* **Special Meal Indicators:** Highlighting for festive or special menus with dynamic UI styling.
* **Secure OAuth:** Google Sign-In restricted to your institution's email domain.

### 📋 Manager Dashboard
* **Menu Management:** Easily add, edit, or remove menu items for any date and meal type.
* **Special Event Tagging:** Mark meals as "Special" to notify users.
* **Real-time Analytics:** View immediate statistics on attendance and rating breakdowns.

### 🛡️ Admin Panel
* **User Management:** Oversee and update user access roles (Student, Manager, Admin).
* **System Settings:** Centralized controls to configure app behavior.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router) & React
* **Styling:** Tailwind CSS & Lucide Icons
* **Backend & Database:** Firebase (Authentication & Firestore)
* **PWA Capability:** Workbox / `@ducanh2912/next-pwa`
* **Mobile Wrapper:** Capacitor for Android native compatibility

---

## ⚙️ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* A Firebase Project (Firestore and Google Authentication enabled)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jalaj-01/MessMeter.git
   cd MessMeter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 📱 Mobile Deployment (Capacitor)

This project is configured to run as a native Android app using Capacitor.

1. **Build the Next.js project:**
   ```bash
   npm run build
   ```
   *Note: Ensure your build output is exported statically if running a pure static Capacitor build (the project is pre-configured with static-friendly settings).*

2. **Sync with Android Project:**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```
   From Android Studio, you can run the app on an emulator or a physical device.

---

## 🔒 Security & Domain Restriction
To prevent unauthorized access:
* The Google Auth flow includes domain-based filtering to ensure only authorized users from your organization can log in.
* Firestore security rules protect meal ratings and attendance configurations to prevent manipulation.

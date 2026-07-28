# 🏠 Airbnb Clone

A full-stack, feature-rich Airbnb clone built with modern web technologies. This application allows users to browse properties, add them to favorites, make mock bookings, and manage their profile. It also features a comprehensive admin dashboard for managing users, listings, and bookings.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v19)** - UI Library
- **Vite** - Build Tool & Development Server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library
- **React Toastify** - Notification system

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB & Mongoose** - Database and ODM
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **BcryptJS** - Password hashing
- **Cloudinary & Multer** - Image upload and storage management

---

## ✨ Key Features

### 1. 👨‍💼 Role-Based Access Control (Admin & User)
- **Admin Dashboard**: View comprehensive stats (total users, listings, bookings, revenue). Manage users, view/delete listings, and track booking statuses.
- **User Dashboard**: Personal stats, view my listings, bookings, and favorites. Easy access to profile and recent activity.
- Distinct and secure routing for both roles.

### 2. ❤️ Favorites / Wishlist
- Add properties to personal favorites using the heart icon.
- View and manage all favorited items in the User Dashboard.
- Persists across user sessions seamlessly.

### 3. 💳 Mock Payment System
- Secure-looking payment UI with card validation, auto-formatting, and a mock processing animation.
- Booking summary displaying property details, dates, and total price.

### 4. 🎨 Modern UI/UX
- **Image Slider**: Smooth transitions between property images on the card with dot indicators and next/prev buttons.
- **Animations**: Hover scale effects, smooth shadow transitions, and responsive feedback.
- Clean dropdown menus, responsive grid layouts, and gradient backgrounds.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection string
- Cloudinary account credentials

### 1. Clone & Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
PORT=8000
```

Start the backend server:
```bash
npm run dev
```

### 2. Setup Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📝 Usage Notes

- **Admin Access**: To access the Admin Dashboard, register a new user normally, then manually update the `role` field in your MongoDB document to `"admin"`. Log out and log back in.
- **Testing Payments**: Use any 16-digit number to test the mock payment process. Do not enter real credit card details.

## 🤝 Contributing
Feel free to fork the repository, make enhancements, and create a pull request!

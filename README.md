# Airbnb Clone

A full-stack Airbnb clone with mock payments, admin dashboard, and user authentication.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
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

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## Features

- User authentication (Login/Signup)
- Property listing and booking
- Mock payment system
- Admin and User dashboards
- Favorites/Wishlist
- Search and filter properties
- Image uploads to Cloudinary

## Default Admin Credentials

Create an admin user by signing up and manually updating the role in MongoDB to "admin".

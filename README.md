

---

# URL Shortener

A MERN stack project that allows users to generate short, shareable URLs. Simply enter a long URL, and this application will generate a shortened link that can be used anywhere, simplifying link management and sharing.

### Live Project Link
[https://shorturlob.onrender.com](https://shorturlob.onrender.com)

---

## Table of Contents
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [About Me](#about-me)
- [Social Links](#-social-links)
- [Skills](#-skills)
- [Installation](#installation)

---

## Deployment

To deploy the project locally, use the following command:

```bash
npm run dev
```

For deployment on a live server, configure the backend and frontend environments and set up production-ready settings.



## Environment Variables

To run this project, you’ll need to set up the following environment variables in your `.env` files.

### Backend:
```plaintext
DBURL=<database_url>
PORT=<backend_port>
SECRETKEY=<jwt_secret>
EMAILFV=<email_for_verification>
PASSKEY=<email_password>
CLIENT_ID=<google_client_id>
CLIENT_SECRET=<google_client_secret>
CLIENT_URL=<frontend_url>
BACKEND_URL=<backend_url>
SESSION_SECRET_KEY=<session_secret_key>
CLOUD_NAME=<cloudinary_cloud_name>
API_KEY=<cloudinary_api_key>
API_SECRET=<cloudinary_api_secret>
API_ENV=<cloudinary_api_env_variable>
COR_URL1=<allowed_cors_url_1>
COR_URL2=<allowed_cors_url_2>
```

### Frontend:
```plaintext
VITE_BACKENDURL=<backend_url_for_frontend>
```

---

## Features

### Backend Features:
- **OTP Verification**: Authenticate users with one-time passcodes.
- **Google Sign-In**: Integrate Google authentication.
- **Real-Time Updates**: Socket.IO for improved user experience and live updates.
- **Password Security**: Password hashing with bcryptjs.
- **Cloudinary Integration**: Store and manage media files with Cloudinary.
- **JWT Authentication**: Secure user sessions with JSON Web Tokens.
- **Authorization**: Enforce access control across the application.
- **File Upload**: Multer for handling profile picture and file uploads.

### Frontend Features:
- **Responsive UI**: Tailwind CSS for design and layout.
- **State Management**: Redux Toolkit for managing application state.
- **Routing**: React Router DOM for seamless navigation.
- **Real-Time Updates**: Socket.IO for improved user experience and live updates.
---

## 🚀 About Me
I'm a full-stack developer with experience in building scalable web applications using modern technologies.

---

## 🔗 Social Links

[![LinkedIn](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/om-bhut-ab93972b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
[![Twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/Om_Bhut1725?t=togZO9AIn7UQTJyuj1sDog&s=08)
[![Instagram](https://img.shields.io/badge/instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/reactivcoderz/profilecard/?igsh=MWp5MHNnNDBkNWtoNw==)

---

## 🛠 Skills
- **Frontend**: React, React Router DOM, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO, Multer, EJS, Passport.js, Nodemailer
- **Programming Languages**: JavaScript, DSA in Java
- **Other**: Cloudinary, JWT, REST APIs

---

## Installation

Clone the repository and install dependencies for both the backend and frontend.

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---


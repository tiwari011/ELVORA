🚀 ELVORA – Smart Living, Simplified
A full‑stack eCommerce web application built with the MERN Stack (MongoDB, Express.js, React, Node.js) featuring bilingual support (Nepali & English), Razorpay integration, admin dashboard, address management, and secure authentication.

🌐 Live Demo
Frontend: 
Backend API: 

🛠 Tech Stack
Frontend
React (Vite)
TailwindCSS
Context API (Auth, Admin, Cart, Language)
Fetch API
React Router
Razorpay SDK
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Bcrypt Password Hashing
Razorpay Payment Verification
Cloudinary Image Upload
Role-based Admin Middleware

✨ Features
👤 User Features
Register & Login
JWT Authentication
Multi-address management
Cart management
COD & Online Payment (Razorpay)
Order tracking
Bilingual support (Nepali default, English optional)
Profile management
🛒 Checkout
Select saved address
Add new address during checkout
Payment verification
Order creation & stock reduction

👨‍💼 Admin Panel
Admin authentication
Dashboard analytics
Manage users
View user addresses
Manage products (CRUD)
Manage categories
Manage orders
Update order status
Restore stock on cancellation
🔐 Security Features
Password hashing using bcrypt
JWT-based authentication
Admin role protection middleware
Secure Razorpay signature verification
Environment variable protection
CORS configuration

📂 Project Structure
text

elvora/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
⚙️ Installation & Setup
1️⃣ Clone Repository
Bash

git clone https://github.com/your-username/elvora.git
cd elvora
2️⃣ Backend Setup
Bash

cd backend
npm install
Create .env file:
text

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
Run backend:

Bash

npm start
3️⃣ Frontend Setup
Bash

cd frontend
npm install
Create .env:

text

VITE_API_URL=http://localhost:5000/api
Run frontend:

Bash

npm run dev
💳 Razorpay Payment Flow
COD:
Create order
Reduce stock
Set order status: Pending
Online:
Create Razorpay order
Complete payment
Verify signature
Create order
Reduce stock
Set order status: Pending
🗄 Database Models
User
Admin
Product
Category
Order
Cart
Review
🌍 Environment Variables
Never commit .env.

Production variables must be configured in:

Render (Backend)
Vercel (Frontend)
🚀 Deployment
Recommended setup:

Service	Platform
Backend	Render
Frontend	Vercel
Database	MongoDB Atlas
Images	Cloudinary
🛡 Production Checklist
Remove console logs
Use strong JWT secret
Enable Helmet
Enable rate limiting
Use HTTPS
Switch Razorpay to LIVE keys
Restrict CORS origins
📸 Screenshots
(Add screenshots here)

👨‍💻 Author
Your Name
GitHub: 
LinkedIn:

📄 License


⭐ Future Improvements
Email notifications
Wishlist
Order invoice generation
Pagination & filtering
SEO optimization
Admin analytics charts
HTTP-only cookie authentication
Docker containerization
🔥 ELVORA
Smart Living, Simplified.


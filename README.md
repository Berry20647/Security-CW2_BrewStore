# 🥜 brewstore beans - E-commerce Platform

A modern, full-stack e-commerce platform for premium coffee beans, built with React, Node.js, and MongoDB. Experience the finest hand-picked coffee beans delivered from the best farms to your kitchen — the brewstore way.

![brewstore beans](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-8.16.1-green)

## ✨ Features

### 🛍️ **E-commerce Features**
- **Product Catalog**: Browse premium coffee beans with detailed product information
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/register with JWT tokens
- **Order Management**: Track order history and status
- **Admin Dashboard**: Complete admin panel for product and order management
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 🎨 **User Experience**
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Search Functionality**: Find products quickly
- **Product Filtering**: Filter by categories and price ranges
- **Real-time Updates**: Live cart updates and notifications
- **Contact Form**: Easy communication with customer support

### 🔐 **Security & Performance**
- **JWT Authentication**: Secure user sessions
- **Password Encryption**: bcryptjs for password hashing
- **CORS Protection**: Cross-origin resource sharing security
- **Image Upload**: Multer for product image management
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **React Icons** - Icon library
- **Framer Motion** - Animation library

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
test brewstore/
├── TestFrontend/                 # React Frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── admin/          # Admin dashboard
│   │   │   ├── allproducts/    # Product catalog
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── contact/        # Contact page
│   │   │   ├── Footer/         # Footer component
│   │   │   ├── Hero/           # Hero section
│   │   │   ├── home/           # Home page
│   │   │   ├── login/          # Login page
│   │   │   ├── Navbar/         # Navigation
│   │   │   ├── productdetails/ # Product details
│   │   │   └── register/       # Registration
│   │   ├── context/            # React context providers
│   │   ├── api/                # API configuration
│   │   └── assets/             # Images and static files
│   └── package.json
├── TestBackend/                 # Node.js Backend
│   ├── config/                 # Database configuration
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Custom middleware
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── uploads/                # Product images
│   └── server.js              # Main server file
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd test-brewstore
```

### 2. Backend Setup
```bash
cd TestBackend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure your `.env` file:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

**Start the backend server:**
```bash
npm start
# Server will run on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd TestFrontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:5174
```

### 4. Database Setup
- Ensure MongoDB is running
- The application will automatically create collections
- Use the admin seed script if needed: `node seedAdmin.js`

## 🎯 Usage

### **For Customers**
1. **Browse Products**: Visit the homepage to see featured products
2. **Create Account**: Register for a new account or login
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: View cart, update quantities, remove items
5. **Checkout**: Complete your order with shipping details
6. **Track Orders**: View order history in your profile

### **For Administrators**
1. **Admin Login**: Access admin dashboard at `/admin`
2. **Product Management**: Add, edit, or remove products
3. **Order Management**: View and update order status
4. **User Management**: Monitor user accounts
5. **Analytics**: View sales and performance metrics

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### **Products**
- `GET /api/coffees` - Get all products
- `GET /api/coffees/:id` - Get specific product
- `POST /api/coffees` - Add new product (admin)
- `PUT /api/coffees/:id` - Update product (admin)
- `DELETE /api/coffees/:id` - Delete product (admin)

### **Orders**
- `POST /api/bookings` - Create new order
- `GET /api/bookings` - Get user orders
- `GET /api/bookings/admin` - Get all orders (admin)

### **Contact**
- `POST /api/contact` - Submit contact form

## 🎨 Key Components

### **Frontend Components**
- **Navbar**: Responsive navigation with user menu
- **Hero Section**: Attractive landing page banner
- **Product Cards**: Display product information with add-to-cart
- **Shopping Cart**: Real-time cart management
- **Admin Dashboard**: Complete admin interface
- **Footer**: Contact information and social links

### **Backend Features**
- **User Authentication**: JWT-based secure authentication
- **Product Management**: CRUD operations for products
- **Order Processing**: Complete order lifecycle
- **File Upload**: Product image management
- **Error Handling**: Comprehensive error responses

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Server-side data validation
- **Error Handling**: Secure error responses

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first approach**
- **Tailwind CSS utilities**
- **Flexible grid layouts**
- **Touch-friendly interfaces**
- **Optimized for all screen sizes**

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
cd TestFrontend
npm run build
# Deploy the dist folder
```

### **Backend Deployment (Heroku/Railway)**
```bash
cd TestBackend
# Set environment variables
# Deploy to your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React, Tailwind CSS, Vite
- **Backend Developer**: Node.js, Express, MongoDB
- **UI/UX Designer**: Modern, responsive design

## 📞 Support

For support and questions:
- **Email**: support@brewstorecoffees.com
- **Website**: [Brew Store beans](https://brewstorecoffees.com)
- **Contact Form**: Available on the website

---

**Made with ❤️ for premium coffee beans lovers**

*Experience the finest hand-picked coffee beans delivered from the best farms to your kitchen — the brewstore way.* 
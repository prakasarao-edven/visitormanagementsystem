# Visitor Management System (VMS)

A comprehensive digital platform for managing visitor registrations, check-ins, and check-outs at organizational premises. Built with Next.js, Node.js, Express, and MySQL.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

The Visitor Management System (VMS) is a digital platform designed to manage visitors entering organizational premises. It replaces traditional paper-based visitor registers with a secure, fast, and user-friendly solution.

### Key Objectives

- ✅ Eliminate manual visitor registers
- ✅ Digitize visitor management process
- ✅ Improve security and visitor tracking
- ✅ Reduce visitor registration time
- ✅ Maintain complete visitor history
- ✅ Generate reports and analytics
- ✅ Support offline operations during internet outages
- ✅ Provide centralized administration and monitoring

## ✨ Features

### Core Features

- **Visitor Registration** - Register visitors with full details
- **Returning Visitor Auto-Fill** - Auto-populate details using mobile number
- **Visitor Pass Generation** - Generate unique Visitor IDs and QR codes
- **Check-In / Check-Out** - Track visitor entry and exit
- **Mobile Number Search** - Quick visitor lookup
- **Active Visitor Monitoring** - View all currently present visitors
- **Visitor History** - Complete visit timeline for each visitor
- **Reports & Analytics** - Daily, monthly, and purpose-wise reports
- **Audit Logs** - Track all system activities
- **Offline Support** - PWA with offline functionality

### Role-Based Access

- **Super Admin** - Full system access, user management
- **Admin** - Operational management and reporting
- **Security** - Daily visitor operations

## 🛠 Technology Stack

### Full-Stack (Single Application)
- **Next.js 14** - React framework with built-in API routes
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **MySQL** - Relational database

### Frontend Features
- **Zustand** - State management
- **Dexie** - IndexedDB wrapper for offline storage (PWA)
- **Axios** - HTTP client
- **QRCode** - QR code generation and scanning
- **React Toastify** - Notifications
- **Tailwind CSS** - Styling

### Backend (API Routes)
- **Next.js API Routes** - Serverless API endpoints
- **mysql2/promise** - MySQL database driver
- **JWT (jsonwebtoken)** - Authentication & authorization
- **bcryptjs** - Password hashing
- **uuid** - Unique identifier generation
- **QRCode** - Server-side QR generation
- **dotenv** - Environment configuration

### DevTools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **TypeScript** - Type safety

## 📁 Project Structure

```
vms/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes (Backend)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── visitors/        # Visitor management endpoints
│   │   ├── visits/          # Visit management endpoints
│   │   └── admin/           # Admin endpoints
│   ├── dashboard/           # Dashboard pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── security/        # Security dashboard
│   │   └── super-admin/     # Super admin dashboard
│   ├── auth/                # Authentication pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # Reusable React Components
│   ├── common/              # Common components
│   ├── forms/               # Form components
│   ├── modals/              # Modal components
│   └── dashboard/           # Dashboard components
│
├── lib/                     # Shared Utilities & Services
│   ├── api/                 # API client utilities
│   ├── db/                  # Database connection
│   ├── middleware/          # Authentication middleware
│   ├── utils/               # Helper utilities
│   ├── hooks/               # Custom React hooks
│   ├── auth/                # Auth utilities
│   ├── services/            # Business logic services
│   └── offline/             # Offline functionality
│
├── types/                   # TypeScript type definitions
├── styles/                  # Additional stylesheets
├── public/                  # Static assets
│   ├── images/
│   └── icons/
│
├── database/               # Database files
│   └── schema.sql         # Complete MySQL schema
│
├── package.json           # All dependencies
├── tsconfig.json          # TypeScript configuration
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

## 💾 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd visitormanagementsystem
```

### 2. Install Dependencies

```bash
npm install
```

All dependencies (frontend, backend, and database) are included in a single `package.json`.

## ⚙️ Configuration

### 1. Copy the Environment Template

From the root directory:
```bash
cp .env.example .env.local
```

### 2. Edit `.env.local` with Your Settings

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=vms_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRY=24h

# QR Code Configuration
QR_EXPIRY_HOURS=24

# Application Configuration
NEXT_PUBLIC_APP_NAME=Visitor Management System
NEXT_PUBLIC_APP_VERSION=1.0.0

# API Configuration (same as app since it's unified)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE=true
NEXT_PUBLIC_ENABLE_QR_SCAN=true
NEXT_PUBLIC_ENABLE_PHOTO_CAPTURE=true
```

## 🗄️ Database Setup

### 1. Create MySQL Database

```bash
# Using MySQL command line
mysql -u root -p
```

```sql
CREATE DATABASE vms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Import Schema

```bash
# From project root
mysql -u root -p vms_db < database/schema.sql
```

### 3. Verify Tables

```bash
mysql -u root -p vms_db -e "SHOW TABLES;"
```

You should see the following tables:
- users
- visitors
- visits
- visit_purposes
- visit_logs
- audit_logs
- system_settings
- user_sessions
- qr_codes

## 🚀 Running the Application

### Development Mode

From the root directory:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

- **Frontend**: `http://localhost:3000`
- **API Routes**: `http://localhost:3000/api/*`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

The built application will run on port 3000

## 📚 API Documentation

All API routes are Next.js API Routes located in the `app/api/` directory.

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "SECURITY"
  }
}
```

### Visitor Endpoints

#### Register Visitor
```
POST /api/visitors/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "idProofType": "Passport",
  "idProofNumber": "ABC123456"
}
```

#### Search Visitor by Mobile
```
GET /api/visitors/search?mobileNumber=9876543210
Authorization: Bearer {token}
```

### Visit Endpoints

#### Create Visit
```
POST /api/visits/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "visitorId": 1,
  "purposeId": 1,
  "personToMeet": "Manager Name",
  "remarks": "Optional remarks"
}
```

#### Check-In
```
POST /api/visits/{visitId}/check-in
Authorization: Bearer {token}
```

#### Check-Out
```
POST /api/visits/{visitId}/check-out
Authorization: Bearer {token}
```

#### Get Active Visits
```
GET /api/visits/active
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer {token}
```

#### Get Reports
```
GET /api/admin/reports?type=daily&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

#### Create User
```
POST /api/admin/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "SECURITY"
}
```

## 👥 User Roles

### Super Admin
- Full system access
- User management
- Role management
- System configuration
- Access to all reports and audit logs

### Admin
- Dashboard access
- Generate reports
- Manage visitor categories
- Manage security users
- View visitor history

### Security
- Register visitors
- Search visitors
- Check-in/Check-out visitors
- View active visitors
- Generate visitor passes

## 🛠️ Development

### Code Style

The project uses ESLint and Prettier for code quality:

```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Running Tests

```bash
# Run all tests
npm test

# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Build for Production

```bash
# Build all
npm run build

# Backend build
cd backend
npm run build

# Frontend build
cd frontend
npm run build
```

## 🔍 Troubleshooting

### Database Connection Error

**Problem:** Cannot connect to MySQL database

**Solution:**
1. Verify MySQL is running: `mysql -u root -p -e "SELECT 1;"`
2. Check database credentials in `.env.local`
3. Ensure database `vms_db` exists
4. Check MySQL port (default: 3306)

### Port 3000 Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Change port in .env.local
PORT=3001

# Then start the app
npm run dev
```

### JWT Token Errors

**Problem:** "Invalid token" errors

**Solution:**
1. Clear browser localStorage
2. Regenerate JWT_SECRET in `.env.local`
3. Re-login to get new token

### Database Schema Not Imported

**Problem:** "Table doesn't exist" errors

**Solution:**
```bash
# Make sure you've imported the schema
mysql -u root -p vms_db < database/schema.sql

# Verify tables exist
mysql -u root -p vms_db -e "SHOW TABLES;"
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
1. Ensure all dependencies are installed: `npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Rebuild: `npm run build`

## 📝 Database Schema Overview

### Users Table
Stores system users with roles (Super Admin, Admin, Security)

### Visitors Table
Stores visitor master data (name, mobile, email, ID proof)

### Visits Table
Stores visit transactions with status (Registered, Checked-In, Checked-Out)

### Visit Logs Table
Tracks all visit-related activities

### Audit Logs Table
Tracks all system activities and changes

### QR Codes Table
Stores generated QR codes for visits

## 📄 License

This project is proprietary and confidential.

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review API documentation
3. Check database schema
4. Contact the development team

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Active Development

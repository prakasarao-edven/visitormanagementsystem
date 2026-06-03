# VMS - Quick Start Guide

## Project Structure

This is a **unified Next.js application** - everything is in one project:
- **Frontend**: React components in `app/` and `components/`
- **Backend**: API routes in `app/api/`
- **Database**: MySQL configuration in `lib/db/`

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database
```bash
mysql -u root -p -e "CREATE DATABASE vms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Import Schema
```bash
mysql -u root -p vms_db < database/schema.sql
```

### 4. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=vms_db
JWT_SECRET=your_secret_key_here
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## File Organization

### API Routes (`app/api/`)
- **`auth/login`** - User login
- **`auth/register`** - Create new user (Super Admin only)
- **`visitors/register`** - Register visitor
- **`visitors/search`** - Search visitor by mobile
- **`visits/create`** - Create new visit
- **`visits/[visitId]/check-in`** - Check-in visitor
- **`visits/[visitId]/check-out`** - Check-out visitor
- **`visits/active`** - Get today's active visits
- **`admin/dashboard`** - Dashboard statistics

### Shared Code (`lib/`)
- **`db/`** - MySQL database connection
- **`middleware/`** - JWT authentication
- **`utils/`** - Code generators, helpers
- **`hooks/`** - Custom React hooks (to be added)
- **`services/`** - Business logic (to be added)

### Frontend Pages (`app/`)
- **`page.tsx`** - Home page
- **`auth/`** - Login/Register pages (to be added)
- **`dashboard/`** - Dashboard pages (to be added)

### Components (`components/`)
- **`common/`** - Reusable UI components
- **`forms/`** - Form components
- **`dashboard/`** - Dashboard-specific components
- **`modals/`** - Modal components

---

## Development Workflow

### Adding a New API Endpoint

1. Create file: `app/api/[resource]/[action]/route.ts`
2. Example: `app/api/reports/daily/route.ts`
3. Import utilities:
   ```typescript
   import { verifyAuth } from '@/lib/middleware/auth';
   import { pool } from '@/lib/db/connection';
   ```
4. Write route handler with authentication

### Adding a Frontend Page

1. Create file: `app/[route]/page.tsx`
2. Use client-side data fetching with Axios
3. Use Zustand for state management

### Adding Components

1. Create in `components/` with proper organization
2. Use TypeScript for type safety
3. Import from existing components as needed

---

## Database Connection

```typescript
import { pool } from '@/lib/db/connection';

const connection = await pool.getConnection();
try {
  const [results] = await connection.query('SELECT * FROM users');
  // Use results
} finally {
  connection.release();
}
```

---

## Authentication

All protected routes use JWT. Include token in header:
```
Authorization: Bearer {token}
```

Check authentication in routes:
```typescript
import { verifyAuth } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Use user.id, user.role, etc.
}
```

---

## Key Features to Build

### Phase 1 (MVP)
- ✅ API Routes (core structure done)
- [ ] Login/Register pages
- [ ] Security Dashboard
- [ ] Admin Dashboard
- [ ] Visitor registration form
- [ ] Check-in/Check-out UI
- [ ] Reports page

### Phase 2
- [ ] QR code scanning
- [ ] Photo capture
- [ ] Offline support (PWA)
- [ ] Audit logging

---

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server

# Production
npm run build              # Build for production
npm start                  # Start production server

# Database
mysql -u root -p vms_db    # Connect to DB
mysql -u root -p vms_db < database/schema.sql  # Import schema

# Linting
npm run lint               # Check code style
```

---

## API Testing

Use any API client (Postman, Insomnia, Thunder Client):

### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Register Visitor
```
POST http://localhost:3000/api/visitors/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com"
}
```

---

## Troubleshooting

**"Cannot find module '@/lib/..."**
- Ensure baseUrl is set in `tsconfig.json`
- Run: `npm install`

**"Database connection failed"**
- Check MySQL is running
- Verify credentials in `.env.local`
- Ensure `vms_db` database exists

**"Port 3000 already in use"**
- Change PORT in `.env.local`
- Or kill process: `lsof -ti:3000 | xargs kill -9`

---

## Next Steps

1. Create login page (`app/auth/login/page.tsx`)
2. Create dashboard pages
3. Build visitor registration form
4. Add offline support with Dexie
5. Implement QR scanning

Happy coding! 🚀

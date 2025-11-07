# Code Judge API Server with Prisma ORM

Production-ready REST API server built with **Express**, **Prisma ORM**, and **NeonDB (PostgreSQL)**.

## 🎯 Features

- ✅ **Prisma ORM** - Type-safe database access with auto-generated types
- ✅ **Clean Architecture** - Service layer pattern for maintainability
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Input Validation** - Zod schemas for request validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Security** - bcrypt password hashing, SQL injection prevention
- ✅ **Pagination** - Built-in pagination support
- ✅ **Health Checks** - Database connection monitoring

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: NeonDB (PostgreSQL)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Real-time**: Socket.io (existing)
- **Queue**: BullMQ + Redis (existing)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
PORT=3000
NODE_ENV=development
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Push Schema to Database

```bash
npx prisma db push
```

Or run migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Start Server

```bash
npm run build
npm run dev
```

Server will start on `http://localhost:3000`

## 📊 Database Schema

### Models

**User**
- id, username, email, passwordHash, profileImage, role
- Relations: problems[], submissions[]

**Problem**
- id, title, description, difficulty, examples, testCases, tags
- timeLimit, memoryLimit, createdBy
- Relations: creator (User), submissions[]

**Submission**
- id, userId, problemId, code, language, status, runtime, memory
- Relations: user (User), problem (Problem)

## 📡 API Endpoints

### Users (`/api/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create user |
| POST | `/login` | Login user |
| GET | `/` | Get all users (paginated) |
| GET | `/:id` | Get user by ID |
| GET | `/search/email?email=` | Get user by email |
| GET | `/search/username?username=` | Get user by username |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user |

### Problems (`/api/problems`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create problem |
| GET | `/` | Get all problems (paginated) |
| GET | `/:id` | Get problem by ID |
| GET | `/difficulty/:difficulty` | Get problems by difficulty |
| GET | `/tag/:tag` | Get problems by tag |
| GET | `/creator/:userId` | Get problems by creator |
| PUT | `/:id` | Update problem |
| DELETE | `/:id` | Delete problem |

### Submissions (`/api/submissions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create submission |
| GET | `/` | Get all submissions (paginated) |
| GET | `/:id` | Get submission by ID |
| GET | `/user/:userId` | Get submissions by user |
| GET | `/problem/:problemId` | Get submissions by problem |
| GET | `/user/:userId/problem/:problemId` | Get user's submissions for problem |
| GET | `/stats/user/:userId` | Get user statistics |
| GET | `/stats/problem/:problemId` | Get problem statistics |
| PATCH | `/:id/status` | Update submission status |
| DELETE | `/:id` | Delete submission |

## 🧪 Testing

### Create User

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Problem

```bash
curl -X POST http://localhost:3000/api/problems \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "Easy",
    "examples": [{"input": "[2,7,11,15], 9", "output": "[0,1]"}],
    "testCases": [{"input": "[2,7,11,15], 9", "expectedOutput": "[0,1]", "hidden": false}],
    "createdBy": 1
  }'
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🛠️ Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (no migrations)
npx prisma db push

# Create and run migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset

# Format schema file
npx prisma format
```

## 📁 Project Structure

```
src/
├── lib/
│   └── prisma.ts              # Prisma client singleton
├── types/
│   └── index.ts               # TypeScript types & DTOs
├── validators/
│   └── index.ts               # Zod validation schemas
├── services/
│   ├── user.service.ts        # User business logic
│   ├── problem.service.ts     # Problem business logic
│   └── submission.service.ts  # Submission business logic
├── controllers/
│   ├── user.controller.ts     # User route handlers
│   ├── problem.controller.ts  # Problem route handlers
│   └── submission.controller.ts # Submission route handlers
├── routes/
│   ├── user.routes.ts         # User routes
│   ├── problem.routes.ts      # Problem routes
│   └── submission.routes.ts   # Submission routes
├── middleware/
│   ├── errorHandler.ts        # Error handling
│   └── validator.ts           # Request validation
└── index.ts                   # Server entry point

prisma/
├── schema.prisma              # Prisma schema
└── migrations/                # Database migrations
```

## 🏗️ Architecture

### Service Layer Pattern

```
Request → Route → Validator → Controller → Service → Prisma → Database
```

**Benefits:**
- Clean separation of concerns
- Easy to test
- Type-safe with Prisma
- Maintainable and scalable

### Prisma Advantages

1. **Type Safety** - Auto-generated types from schema
2. **Migrations** - Version-controlled database changes
3. **Query Builder** - Intuitive API for complex queries
4. **Relations** - Easy handling of foreign keys
5. **Studio** - Built-in database GUI

## 🔒 Security

- **Password Hashing**: bcrypt with 10 salt rounds
- **SQL Injection**: Prevented by Prisma's query builder
- **Input Validation**: Zod schemas validate all inputs
- **Error Sanitization**: No sensitive data in error responses

## 📊 Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🚀 Deployment

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NODE_ENV=production
PORT=3000
```

### Build & Start

```bash
npm run build
npm start
```

### Database Migration

```bash
npx prisma migrate deploy
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NeonDB Documentation](https://neon.tech/docs)
- [Express Documentation](https://expressjs.com/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contributing

1. Follow the service layer pattern
2. Add Zod validation for new endpoints
3. Use Prisma for all database operations
4. Write type-safe code
5. Handle errors properly
6. Update documentation

## 📄 License

ISC

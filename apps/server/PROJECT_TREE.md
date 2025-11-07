# 📁 Project Structure

## Complete File Tree

```
apps/server/
├── prisma/
│   ├── schema.prisma              # Database schema (User, Problem, Submission)
│   └── migrations/                # Database migrations (auto-generated)
│
├── src/
│   ├── config/
│   │   ├── bullMQ.ts             # BullMQ configuration (existing)
│   │   └── websocket.ts          # WebSocket & Express setup (existing)
│   │
│   ├── controllers/
│   │   ├── user.controller.ts    # User request handlers
│   │   ├── problem.controller.ts # Problem request handlers
│   │   ├── submission.controller.ts # Submission request handlers
│   │   └── submitController.ts   # Submit controller (existing)
│   │
│   ├── lib/
│   │   └── prisma.ts             # Prisma client singleton
│   │
│   ├── middleware/
│   │   ├── errorHandler.ts       # Error handling middleware
│   │   └── validator.ts          # Zod validation middleware
│   │
│   ├── routes/
│   │   ├── user.routes.ts        # User API routes
│   │   ├── problem.routes.ts     # Problem API routes
│   │   ├── submission.routes.ts  # Submission API routes
│   │   └── submitroute.ts        # Submit route (existing)
│   │
│   ├── services/
│   │   ├── user.service.ts       # User business logic
│   │   ├── problem.service.ts    # Problem business logic
│   │   └── submission.service.ts # Submission business logic
│   │
│   ├── types/
│   │   ├── index.ts              # TypeScript types & DTOs
│   │   └── types.ts              # Additional types (existing)
│   │
│   ├── validators/
│   │   └── index.ts              # Zod validation schemas
│   │
│   └── index.ts                  # Server entry point
│
├── dist/                          # Compiled JavaScript (auto-generated)
│
├── node_modules/                  # Dependencies
│
├── .env                          # Environment variables (create this)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies & scripts
├── prisma.config.ts              # Prisma configuration
├── tsconfig.json                 # TypeScript configuration
│
└── Documentation/
    ├── README.md                 # Complete API documentation
    ├── SETUP.md                  # Quick setup guide
    ├── PRISMA_GUIDE.md          # Prisma ORM tutorial
    ├── SUMMARY.md               # Project overview
    └── PROJECT_TREE.md          # This file
```

## 📊 File Count

### Source Code
- **Controllers**: 4 files
- **Services**: 3 files
- **Routes**: 4 files
- **Middleware**: 2 files
- **Validators**: 1 file
- **Types**: 2 files
- **Lib**: 1 file
- **Config**: 2 files
- **Total**: 19 TypeScript files

### Documentation
- **Guides**: 4 markdown files
- **Schema**: 1 Prisma schema file
- **Config**: 2 configuration files

### Total Project Files: 26+

## 🎯 Key Directories

### `/prisma`
Database schema and migrations. Run `npx prisma studio` to view database visually.

### `/src/lib`
Shared utilities and clients. Contains Prisma client singleton.

### `/src/services`
Business logic layer. All database operations go through services.

### `/src/controllers`
Request handlers. Parse requests, call services, format responses.

### `/src/routes`
API endpoint definitions. Connect URLs to controllers.

### `/src/middleware`
Express middleware. Error handling and validation.

### `/src/validators`
Zod schemas for input validation.

### `/src/types`
TypeScript interfaces and DTOs.

## 🔄 Data Flow

```
Request
  ↓
Route (/api/users)
  ↓
Validator (Zod schema)
  ↓
Controller (user.controller.ts)
  ↓
Service (user.service.ts)
  ↓
Prisma Client (lib/prisma.ts)
  ↓
Database (NeonDB)
  ↓
Response
```

## 📝 File Descriptions

### Core Files

**`src/index.ts`**
- Server entry point
- Registers routes
- Error handling
- Health checks

**`src/lib/prisma.ts`**
- Prisma client singleton
- Connection pooling
- Query logging

### Service Layer

**`src/services/user.service.ts`**
- User CRUD operations
- Password hashing
- Email/username uniqueness
- User sanitization

**`src/services/problem.service.ts`**
- Problem CRUD operations
- Test case filtering (hidden/visible)
- Difficulty filtering
- Tag-based search

**`src/services/submission.service.ts`**
- Submission CRUD operations
- Status updates
- User/problem statistics
- Filtering by user/problem

### Controllers

**`src/controllers/user.controller.ts`**
- Create user
- Login
- Get users (all/by ID/email/username)
- Update/delete user

**`src/controllers/problem.controller.ts`**
- Create problem
- Get problems (all/by ID/difficulty/tag/creator)
- Update/delete problem

**`src/controllers/submission.controller.ts`**
- Create submission
- Get submissions (all/by ID/user/problem)
- Get statistics
- Update status
- Delete submission

### Routes

**`src/routes/user.routes.ts`**
- POST `/api/users` - Create user
- POST `/api/users/login` - Login
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

**`src/routes/problem.routes.ts`**
- POST `/api/problems` - Create problem
- GET `/api/problems` - Get all problems
- GET `/api/problems/:id` - Get problem by ID
- GET `/api/problems/difficulty/:difficulty` - Filter by difficulty
- GET `/api/problems/tag/:tag` - Filter by tag
- PUT `/api/problems/:id` - Update problem
- DELETE `/api/problems/:id` - Delete problem

**`src/routes/submission.routes.ts`**
- POST `/api/submissions` - Create submission
- GET `/api/submissions` - Get all submissions
- GET `/api/submissions/:id` - Get submission by ID
- GET `/api/submissions/user/:userId` - Get by user
- GET `/api/submissions/problem/:problemId` - Get by problem
- GET `/api/submissions/stats/user/:userId` - User stats
- PATCH `/api/submissions/:id/status` - Update status
- DELETE `/api/submissions/:id` - Delete submission

### Middleware

**`src/middleware/errorHandler.ts`**
- AppError class
- Prisma error handling
- Error sanitization
- asyncHandler wrapper

**`src/middleware/validator.ts`**
- Zod schema validation
- Request body validation
- Error formatting

### Validators

**`src/validators/index.ts`**
- createUserSchema
- updateUserSchema
- loginSchema
- createProblemSchema
- updateProblemSchema
- createSubmissionSchema
- updateSubmissionStatusSchema

### Types

**`src/types/index.ts`**
- CreateUserDTO
- UpdateUserDTO
- UserResponse
- CreateProblemDTO
- UpdateProblemDTO
- ProblemResponse
- CreateSubmissionDTO
- SubmissionResponse
- SubmissionStats

### Configuration

**`prisma/schema.prisma`**
- User model
- Problem model
- Submission model
- Relations
- Indexes

**`prisma.config.ts`**
- Prisma configuration
- Environment variables
- Migration settings

## 🎨 Architecture Pattern

### Service Layer Pattern

```
┌─────────────────────────────────┐
│         Presentation            │
│    (Routes + Controllers)       │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│       Business Logic            │
│         (Services)              │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│       Data Access               │
│      (Prisma Client)            │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│         Database                │
│         (NeonDB)                │
└─────────────────────────────────┘
```

### Benefits

✅ **Separation of Concerns** - Each layer has single responsibility
✅ **Testability** - Easy to mock services for testing
✅ **Maintainability** - Changes isolated to specific layers
✅ **Reusability** - Services can be used by multiple controllers
✅ **Type Safety** - Prisma provides end-to-end type safety

## 🔍 Finding Files

### By Feature

**User Management**
- `services/user.service.ts`
- `controllers/user.controller.ts`
- `routes/user.routes.ts`
- `validators/index.ts` (user schemas)

**Problem Management**
- `services/problem.service.ts`
- `controllers/problem.controller.ts`
- `routes/problem.routes.ts`
- `validators/index.ts` (problem schemas)

**Submission Management**
- `services/submission.service.ts`
- `controllers/submission.controller.ts`
- `routes/submission.routes.ts`
- `validators/index.ts` (submission schemas)

### By Layer

**Database Layer**
- `prisma/schema.prisma`
- `lib/prisma.ts`

**Business Logic Layer**
- `services/*.service.ts`

**Presentation Layer**
- `controllers/*.controller.ts`
- `routes/*.routes.ts`

**Validation Layer**
- `validators/index.ts`
- `middleware/validator.ts`

**Error Handling**
- `middleware/errorHandler.ts`

## 📚 Documentation Map

| File | Purpose | Audience |
|------|---------|----------|
| **README.md** | Complete API reference | Developers |
| **SETUP.md** | Quick start guide | New developers |
| **PRISMA_GUIDE.md** | Prisma ORM tutorial | Developers learning Prisma |
| **SUMMARY.md** | Project overview | Everyone |
| **PROJECT_TREE.md** | File structure | Developers |

## 🚀 Getting Started

1. Read `SUMMARY.md` for overview
2. Follow `SETUP.md` for setup
3. Check `README.md` for API details
4. Learn Prisma from `PRISMA_GUIDE.md`
5. Explore code starting from `src/index.ts`

---

**Navigate the codebase with confidence! 📁**

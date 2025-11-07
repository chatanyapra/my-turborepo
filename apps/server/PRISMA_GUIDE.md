# Prisma ORM Complete Guide

## 🎯 Why Prisma?

### Advantages Over Raw SQL

✅ **Type Safety** - Auto-generated TypeScript types from schema
✅ **Auto-completion** - IntelliSense for all queries
✅ **Migrations** - Version-controlled database changes
✅ **Relations** - Easy handling of foreign keys and joins
✅ **Query Builder** - Intuitive, readable API
✅ **Prisma Studio** - Built-in database GUI
✅ **No SQL Injection** - Parameterized queries by default

### Comparison

**Raw SQL:**
```typescript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
const user = result.rows[0];
```

**Prisma:**
```typescript
const user = await prisma.user.findUnique({
  where: { email }
});
```

---

## 📊 Schema Definition

### Basic Model

```prisma
model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String?
  posts    Post[]
  
  @@map("users")
}
```

### Field Types

```prisma
model Example {
  // Numbers
  int       Int
  bigInt    BigInt
  float     Float
  decimal   Decimal
  
  // Strings
  string    String
  text      String   @db.Text
  varchar   String   @db.VarChar(255)
  
  // Boolean
  isActive  Boolean  @default(true)
  
  // Dates
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // JSON
  metadata  Json
  
  // Arrays (PostgreSQL)
  tags      String[]
  
  // Optional
  optional  String?
}
```

### Relations

```prisma
// One-to-Many
model User {
  id       Int       @id @default(autoincrement())
  posts    Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}

// Many-to-Many
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

---

## 🔍 Query Examples

### Create

```typescript
// Create single record
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: hashedPassword,
  }
});

// Create with relations
const problem = await prisma.problem.create({
  data: {
    title: 'Two Sum',
    difficulty: 'Easy',
    creator: {
      connect: { id: userId }
    }
  }
});

// Create many
await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', username: 'user1' },
    { email: 'user2@example.com', username: 'user2' },
  ]
});
```

### Read

```typescript
// Find unique
const user = await prisma.user.findUnique({
  where: { id: 1 }
});

// Find first
const user = await prisma.user.findFirst({
  where: { email: 'test@example.com' }
});

// Find many
const users = await prisma.user.findMany({
  where: {
    role: 'admin',
    createdAt: {
      gte: new Date('2024-01-01')
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Find with relations
const problem = await prisma.problem.findUnique({
  where: { id: 1 },
  include: {
    creator: true,
    submissions: {
      take: 5,
      orderBy: { createdAt: 'desc' }
    }
  }
});

// Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    email: true,
  }
});
```

### Update

```typescript
// Update single
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    username: 'newusername',
    updatedAt: new Date(),
  }
});

// Update many
await prisma.submission.updateMany({
  where: { status: 'Pending' },
  data: { status: 'Running' }
});

// Upsert (update or create)
const user = await prisma.user.upsert({
  where: { email: 'test@example.com' },
  update: { username: 'updated' },
  create: {
    email: 'test@example.com',
    username: 'testuser',
  }
});
```

### Delete

```typescript
// Delete single
await prisma.user.delete({
  where: { id: 1 }
});

// Delete many
await prisma.submission.deleteMany({
  where: {
    createdAt: {
      lt: new Date('2023-01-01')
    }
  }
});
```

### Advanced Queries

```typescript
// Count
const count = await prisma.user.count({
  where: { role: 'admin' }
});

// Aggregate
const stats = await prisma.submission.aggregate({
  where: { userId: 1 },
  _count: true,
  _avg: { runtime: true },
  _max: { runtime: true },
});

// Group by
const problemsByDifficulty = await prisma.problem.groupBy({
  by: ['difficulty'],
  _count: true,
});

// Raw query (when needed)
const result = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;
```

### Filtering

```typescript
// OR condition
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: 'test@example.com' },
      { username: 'testuser' }
    ]
  }
});

// AND condition
const problems = await prisma.problem.findMany({
  where: {
    AND: [
      { difficulty: 'Easy' },
      { tags: { has: 'array' } }
    ]
  }
});

// NOT condition
const users = await prisma.user.findMany({
  where: {
    NOT: { role: 'admin' }
  }
});

// Array operations
const problems = await prisma.problem.findMany({
  where: {
    tags: {
      has: 'dynamic-programming',      // contains
      hasSome: ['array', 'hash-table'], // contains any
      hasEvery: ['array', 'sorting'],   // contains all
    }
  }
});

// String operations
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com',
      startsWith: 'test',
      endsWith: '.com',
    }
  }
});

// Number operations
const submissions = await prisma.submission.findMany({
  where: {
    runtime: {
      gte: 100,  // greater than or equal
      lte: 1000, // less than or equal
    }
  }
});
```

---

## 🔄 Transactions

```typescript
// Sequential transaction
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'test@example.com', username: 'test' }
  });
  
  const problem = await tx.problem.create({
    data: {
      title: 'Test Problem',
      difficulty: 'Easy',
      createdBy: user.id,
    }
  });
  
  return { user, problem };
});

// Batch transaction
await prisma.$transaction([
  prisma.user.create({ data: { email: 'user1@example.com' } }),
  prisma.user.create({ data: { email: 'user2@example.com' } }),
]);
```

---

## 🛠️ Migrations

### Create Migration

```bash
# Create migration from schema changes
npx prisma migrate dev --name add_user_bio

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Migration Files

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

---

## 🎨 Prisma Studio

```bash
# Open Prisma Studio
npx prisma studio
```

Features:
- Visual database browser
- Edit records directly
- Filter and search
- View relations
- Runs on http://localhost:5555

---

## 🔧 Best Practices

### 1. Use Singleton Pattern

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
```

### 2. Handle Errors

```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('Email already exists');
    }
  }
  throw error;
}
```

### 3. Use Transactions for Related Operations

```typescript
// Good: Atomic operation
await prisma.$transaction(async (tx) => {
  await tx.user.delete({ where: { id } });
  await tx.submission.deleteMany({ where: { userId: id } });
});

// Bad: Non-atomic, can fail partially
await prisma.user.delete({ where: { id } });
await prisma.submission.deleteMany({ where: { userId: id } });
```

### 4. Select Only Needed Fields

```typescript
// Good: Only fetch needed fields
const users = await prisma.user.findMany({
  select: { id: true, username: true, email: true }
});

// Bad: Fetches all fields including passwordHash
const users = await prisma.user.findMany();
```

### 5. Use Pagination

```typescript
const page = 1;
const limit = 20;

const [users, total] = await Promise.all([
  prisma.user.findMany({
    take: limit,
    skip: (page - 1) * limit,
  }),
  prisma.user.count(),
]);
```

---

## 🐛 Common Errors

### P2002: Unique Constraint Violation
```typescript
// Error: Email already exists
if (error.code === 'P2002') {
  throw new Error('Resource already exists');
}
```

### P2003: Foreign Key Constraint
```typescript
// Error: Referenced record doesn't exist
if (error.code === 'P2003') {
  throw new Error('Invalid reference');
}
```

### P2025: Record Not Found
```typescript
// Error: Record to update/delete not found
if (error.code === 'P2025') {
  throw new Error('Resource not found');
}
```

---

## 📊 Performance Tips

1. **Use Indexes**
```prisma
model User {
  email String @unique
  
  @@index([createdAt])
}
```

2. **Batch Operations**
```typescript
// Good: Single query
await prisma.user.createMany({ data: users });

// Bad: Multiple queries
for (const user of users) {
  await prisma.user.create({ data: user });
}
```

3. **Connection Pooling**
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

4. **Query Optimization**
```typescript
// Use select instead of include when possible
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    username: true,
    posts: {
      select: { id: true, title: true }
    }
  }
});
```

---

## 🔗 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Examples](https://github.com/prisma/prisma-examples)

---

**Prisma makes database access type-safe and developer-friendly! 🚀**

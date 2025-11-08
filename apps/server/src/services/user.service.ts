import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from '../types';

class UserService {
  private readonly SALT_ROUNDS = 10;

  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('Email already exists');
      }
      throw new Error('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        profileImage: data.profileImage,
        role: data.role || 'user',
      },
    });
    console.log("user in controller- ", user);


    return this.sanitizeUser(user);
  }

  async getUserById(id: number): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.sanitizeUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.sanitizeUser(user) : null;
  }

  async getUserByUsername(username: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user ? this.sanitizeUser(user) : null;
  }

  async getAllUsers(limit: number = 50, offset: number = 0): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.sanitizeUser(user));
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check for duplicate email/username
    if (data.email || data.username) {
      const duplicate = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                data.email ? { email: data.email } : {},
                data.username ? { username: data.username } : {},
              ].filter((obj) => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (duplicate) {
        if (duplicate.email === data.email) {
          throw new Error('Email already in use');
        }
        throw new Error('Username already in use');
      }
    }

    // Hash password if provided
    const updateData: any = { ...data };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS);
      delete updateData.password;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return this.sanitizeUser(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyPassword(email: string, password: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async getUserCount(): Promise<number> {
    return await prisma.user.count();
  }

  private sanitizeUser(user: any): UserResponse {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export default new UserService();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prisma';

// Types
interface RegisterData {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    location?: string;
    currentRole?: string;
    currentCompany?: string;
    totalYears?: number;
    currentCtc?: number;
    expectedCtc?: number;
    noticePeriod?: number;
    skills?: string[];
    preferences?: Record<string, any>;
}

interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}

interface RegisterResponse {
    success: boolean;
    userId: string;
    token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
    };
}

interface JWTPayload {
    userId: string;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

class AuthService {
    private saltRounds = 10;

    validatePassword(password: string): boolean {
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new Error('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new Error('Password must contain at least one special character');
        }
        return true;
    }

    async register(userData: RegisterData): Promise<RegisterResponse> {
        const { email, password, name, skills, preferences, ...rest } = userData;

        try {
            // Validate password strength
            this.validatePassword(password);

            // Check if user exists (using Prisma)
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, this.saltRounds);

            // Create user with Prisma
            const user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    name: name || null,
                    skills: skills ? JSON.stringify(skills) : null,
                    preferences: preferences ? JSON.stringify(preferences) : null,
                    ...rest
                }
            });

            // Generate token
            const token = this.generateToken(user.id);

            return {
                success: true,
                userId: user.id,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Find user with Prisma
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.passwordHash) {
                throw new Error('Invalid account configuration');
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.passwordHash);

            if (!validPassword) {
                throw new Error('Invalid password');
            }

            // Generate token
            const token = this.generateToken(user.id);

            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(
                token,
                process.env.JWT_SECRET || 'default_secret'
            ) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Middleware to protect routes
    authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                res.status(401).json({ error: 'No token provided' });
                return;
            }

            const decoded = this.verifyToken(token);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

export default AuthService;

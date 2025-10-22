import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/user.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  /**
   * Generate JWT token
   */
  private static generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as 
    );
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name }: RegisterRequest = req.body;

      // Validation
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          message: 'Please provide email, password, and name',
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
        return;
      }

      // Password validation (minimum 6 characters)
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long',
        });
        return;
      }

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Create new user
      const user = await UserModel.create({ email, password, name });

      // Generate token
      const token = this.generateToken(user.id, user.email, user.role);

      // Send response
      const response: AuthResponse = {
        user,
        token,
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: response,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide email and password',
        });
        return;
      }

      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await UserModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Generate token
      const token = this.generateToken(user.id, user.email, user.role);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Send response
      const response: AuthResponse = {
        user: userWithoutPassword,
        token,
      };

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: response,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

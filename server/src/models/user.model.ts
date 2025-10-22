import pool from '../config/database';
import bcrypt from 'bcrypt';
import { User, UserCreateInput, UserResponse } from '../types/user.types';

const SALT_ROUNDS = 10;

export class UserModel {
  /**
   * Create a new user with hashed password
   */
  static async create(userData: UserCreateInput): Promise<UserResponse> {
    const { email, password, name, role = 'customer' } = userData;

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `
      INSERT INTO users (email, password, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role, created_at, updated_at
    `;

    const values = [email, hashedPassword, name, role];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  /**
   * Verify user password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await pool.query(query, [email]);

    return result.rows[0].exists;
  }

  /**
   * Update user
   */
  static async update(id: number, updates: Partial<UserCreateInput>): Promise<UserResponse | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }
    if (updates.name) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, SALT_ROUNDS);
      fields.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (updates.role) {
      fields.push(`role = $${paramCount++}`);
      values.push(updates.role);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete user
   */
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);

    return (result.rowCount ?? 0) > 0;
  }
}

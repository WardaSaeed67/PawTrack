/**
 * Password Security — bcryptjs
 * 
 * Handles password hashing and verification.
 * bcryptjs works in both Node.js and Edge runtimes.
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password.
 * @param {string} plainPassword - The plaintext password
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a hash.
 * @param {string} plainPassword - The plaintext password to check
 * @param {string} hashedPassword - The stored hash to compare against
 * @returns {Promise<boolean>} True if the password matches
 */
export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

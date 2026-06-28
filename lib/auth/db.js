/**
 * Database Layer — PostgreSQL Placeholder
 * 
 * This module provides the database interface for authentication.
 * Currently uses an IN-MEMORY store so auth works without PostgreSQL.
 * 
 * ============================================================
 * POSTGRESQL INTEGRATION GUIDE:
 * 
 * When you're ready to connect PostgreSQL:
 * 
 * 1. Install the driver:
 *    npm install pg
 * 
 * 2. Add to .env.local:
 *    DATABASE_URL=postgresql://user:password@localhost:5432/pawtrack
 * 
 * 3. Create the users table:
 *    CREATE TABLE users (
 *      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *      name VARCHAR(255) NOT NULL,
 *      email VARCHAR(255) UNIQUE NOT NULL,
 *      password VARCHAR(255) NOT NULL,
 *      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *    );
 * 
 * 4. Replace the 3 functions below with real SQL queries.
 *    Each function has a TODO comment showing the exact query.
 * ============================================================
 */

// ── In-Memory Store (temporary until PostgreSQL is connected) ──
// This allows the auth system to work immediately without a database.
const users = [];
let nextId = 1;

/**
 * Find a user by their email address.
 * @param {string} email
 * @returns {Promise<object|null>} The user object or null
 */
export async function findUserByEmail(email) {
  // TODO: PostgreSQL — Replace with:
  // const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  // return result.rows[0] || null;

  return users.find(u => u.email === email.toLowerCase()) || null;
}

/**
 * Create a new user in the database.
 * @param {string} name - Full name
 * @param {string} email - Email address
 * @param {string} hashedPassword - Already-hashed password
 * @returns {Promise<object>} The created user (without password)
 */
export async function createUser(name, email, hashedPassword) {
  // TODO: PostgreSQL — Replace with:
  // const result = await pool.query(
  //   'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
  //   [name, email.toLowerCase(), hashedPassword]
  // );
  // return result.rows[0];

  const user = {
    id: String(nextId++),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    created_at: new Date().toISOString(),
  };
  users.push(user);

  // Return user without password
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Find a user by their ID.
 * @param {string} id - The user's unique ID
 * @returns {Promise<object|null>} The user object (without password) or null
 */
export async function findUserById(id) {
  // TODO: PostgreSQL — Replace with:
  // const result = await pool.query(
  //   'SELECT id, name, email, created_at FROM users WHERE id = $1',
  //   [id]
  // );
  // return result.rows[0] || null;

  const user = users.find(u => u.id === id);
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

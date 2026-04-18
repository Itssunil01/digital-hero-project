import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database';

const router = express.Router();

// Helper to promisify db.get
const dbGet = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper to promisify db.run
const dbRun = (query: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await dbRun('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);

    // Generate token
    const token = jwt.sign({ id: result.lastID, email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
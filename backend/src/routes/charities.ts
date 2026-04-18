import express from 'express';
import db from '../database';
import authMiddleware from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends express.Request {
  user?: any;
}

// Helper to promisify db.all
const dbAll = (query: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

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

// Get all charities
router.get('/', async (req, res) => {
  try {
    const charities = await dbAll('SELECT * FROM charities');
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get charity by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await dbGet('SELECT * FROM charities WHERE id = ?', [id]);
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create charity (protected)
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  const { name, description, goal } = req.body;
  const userId = req.user.id;

  if (!name || !goal) {
    return res.status(400).json({ message: 'Name and goal are required' });
  }

  try {
    const result = await dbRun('INSERT INTO charities (name, description, goal, user_id) VALUES (?, ?, ?, ?)', [name, description, goal, userId]);
    res.status(201).json({ id: result.lastID, message: 'Charity created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update charity (protected, only owner)
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, description, goal } = req.body;
  const userId = req.user.id;

  try {
    const charity = await dbGet('SELECT * FROM charities WHERE id = ?', [id]);
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }
    if (charity.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await dbRun('UPDATE charities SET name = ?, description = ?, goal = ? WHERE id = ?', [name, description, goal, id]);
    res.json({ message: 'Charity updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete charity (protected, only owner)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const charity = await dbGet('SELECT * FROM charities WHERE id = ?', [id]);
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }
    if (charity.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await dbRun('DELETE FROM charities WHERE id = ?', [id]);
    res.json({ message: 'Charity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
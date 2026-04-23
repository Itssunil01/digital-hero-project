"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Helper to promisify db.all
const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        database_1.default.all(query, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
// Helper to promisify db.get
const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        database_1.default.get(query, params, (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
// Helper to promisify db.run
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        database_1.default.run(query, params, function (err) {
            if (err)
                reject(err);
            else
                resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};
// Get all charities
router.get('/', async (req, res) => {
    try {
        const charities = await dbAll('SELECT * FROM charities');
        res.json(charities);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create charity (protected)
router.post('/', auth_1.default, async (req, res) => {
    const { name, description, goal } = req.body;
    const userId = req.user.id;
    if (!name || !goal) {
        return res.status(400).json({ message: 'Name and goal are required' });
    }
    try {
        const result = await dbRun('INSERT INTO charities (name, description, goal, user_id) VALUES (?, ?, ?, ?)', [name, description, goal, userId]);
        res.status(201).json({ id: result.lastID, message: 'Charity created' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update charity (protected, only owner)
router.put('/:id', auth_1.default, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete charity (protected, only owner)
router.delete('/:id', auth_1.default, async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=charities.js.map
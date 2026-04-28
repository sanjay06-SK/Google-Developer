import express from 'express';
import { getDb } from '../data/database.js';

const router = express.Router();

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const db = await getDb();
    const volunteerCount = await db.get('SELECT COUNT(*) as count FROM volunteers');
    const allocationCount = await db.get('SELECT COUNT(*) as count FROM allocations');
    const criticalNeedsCount = await db.get('SELECT COUNT(*) as count FROM allocations WHERE type = "danger"');
    
    res.json({ 
      success: true, 
      data: {
        totalVolunteers: volunteerCount.count,
        activeAllocations: allocationCount.count,
        criticalNeeds: criticalNeedsCount.count,
        responseTimeHours: 1.4 // Mock value for now
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Volunteers List
router.get('/volunteers', async (req, res) => {
  try {
    const db = await getDb();
    const { status } = req.query;
    let query = 'SELECT * FROM volunteers';
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    const volunteers = await db.all(query, params);
    res.json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add New Volunteer
router.post('/volunteers', async (req, res) => {
  try {
    const { name, role, distance } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and role are required' });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO volunteers (name, role, distance, status) VALUES (?, ?, ?, ?)',
      [name, role, distance || '0.0km', 'available']
    );
    
    const newVolunteer = await db.get('SELECT * FROM volunteers WHERE id = ?', result.lastID);
    res.status(201).json({ success: true, data: newVolunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Allocations List
router.get('/allocations', async (req, res) => {
  try {
    const db = await getDb();
    const allocations = await db.all('SELECT * FROM allocations ORDER BY id DESC');
    res.json({ success: true, data: allocations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add New Allocation
router.post('/allocations', async (req, res) => {
  try {
    const { title, location, type, status } = req.body;
    
    if (!title || !location) {
      return res.status(400).json({ success: false, message: 'Title and location are required' });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO allocations (title, location, status, type, progress, time) VALUES (?, ?, ?, ?, ?, ?)',
      [title, location, status || 'Pending', type || 'info', 0, 'Just now']
    );
    
    const newAllocation = await db.get('SELECT * FROM allocations WHERE id = ?', result.lastID);
    res.status(201).json({ success: true, data: newAllocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

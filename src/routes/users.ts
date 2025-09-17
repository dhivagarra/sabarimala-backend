import { Router } from 'express';
import bcrypt from 'bcryptjs';

import pool from '../db';
import { TblUser } from '../types';

const router = Router();

// 1. Create User
router.post('/', async (req, res) => {
  const {
    userid,
    password,
    firstname,
    lastname,
    username,
    mobilenumber,
    email,
    role,
    isactive,
    cretedby,
    modifiedby
  } = req.body;
  if (!userid || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const insertQuery = `
      INSERT INTO tblusers (
        userid, password_hash, firstname, lastname, username, mobilenumber, email, role, isactive, cretedby, modifiedby
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *
    `;
    const values = [
      userid, password_hash, firstname, lastname, username, mobilenumber || null, email || null, role || null, isactive || 'Y', cretedby || null, modifiedby || null
    ];
    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];
    if (user) delete user.password_hash;
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'User creation failed', details: err });
  }
});

// 2. Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tblusers');
    // Remove password_hash from all users
    const users = result.rows.map(u => { const { password_hash, ...rest } = u; return rest; });
    res.json({ rowCount: result.rowCount, data: users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err });
  }
});

// 3. Get user by userid
router.get('/userid/:userid', async (req, res) => {
  const { userid } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tblusers WHERE userid = $1', [userid]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = result.rows[0];
      if (user) delete user.password_hash;
      res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err });
  }
});

// 4. Update user by userid
router.put('/userid/:userid', async (req, res) => {
  const { userid } = req.params;
  const fields = [
    'firstname', 'lastname', 'username', 'mobilenumber', 'email', 'role', 'isactive', 'cretedby', 'modifiedby'
  ];
  const updates = [];
  const values = [];
  let idx = 1;
  // Handle password update separately
  if (req.body.password) {
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(req.body.password, saltRounds);
    updates.push(`password_hash = $${idx}`);
    values.push(password_hash);
    idx++;
  }
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${idx}`);
      values.push(req.body[field]);
      idx++;
    }
  }
  // Always update modifiedat to current timestamp
  updates.push(`modifiedat = CURRENT_TIMESTAMP`);
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  values.push(userid);
  const updateQuery = `UPDATE tblusers SET ${updates.join(', ')} WHERE userid = $${idx} RETURNING *`;
  try {
    const result = await pool.query(updateQuery, values);
    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      if (user) delete user.password_hash;
      res.json({ user });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err });
  }
});

// 5. Login user with userid and password_hash
router.post('/login', async (req, res) => {
  const { userid, password } = req.body;
  if (!userid || !password) {
    return res.status(400).json({ error: 'Missing userid or password' });
  }
  try {
    const result = await pool.query('SELECT * FROM tblusers WHERE userid = $1', [userid]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user) delete user.password_hash;
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err });
  }
});

export default router;

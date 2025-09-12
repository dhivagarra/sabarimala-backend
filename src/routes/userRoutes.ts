import { Router } from 'express';
import sql from 'mssql';
import { createUser, verifyUser, getAllUsers } from '../services/userService';

const router = Router();

// Register user
router.post('/register', async (req, res) => {
  const { userId, password, userName, mobilenumber, email, role, isActive, cretedBy } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: 'UserId and password required' });
  }
  try {
    await createUser({ userId, password, userName, mobilenumber, email, role, isActive, cretedBy });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Get user by userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getAllUsers();
    const found = user.find((u: any) => u.userId === userId);
    if (!found) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(found);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching user.', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: 'UserId and password required' });
  }
  const valid = await verifyUser(userId, password);
  if (valid) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// (Handled above)

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
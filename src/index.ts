import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRouter from './routes/users';
import packlogRouter from './routes/packlog';
import valuesetRouter from './routes/valueset';
import pool from './db';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});


// Test DB connection route
app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err });
  }
});

// Mount users API routes
app.use('/users', usersRouter);
app.use('/packlog', packlogRouter);
app.use('/valueset', valuesetRouter);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

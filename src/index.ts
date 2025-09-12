import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';
// new coded added for logging and error handling
import userRoutes from './routes/userRoutes';
import packLogRoutes from './routes/packLogRoutes';
import vanchiRoutes from './routes/vanchiRoutes';
import valuesetRoutes from './routes/valuesetRoutes';
import { morganMiddleware } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';

dotenv.config();


const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : (process.env.USE_HTTPS === 'true' ? 443 : 80);
import path from 'path';
// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// For any route not handled by API, serve React index.html

// Serve React index.html only for non-API routes
app.get(/^((?!\/api\/).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

/*
const config = {
  user: 'iaasadmin',
  password: 'securraiaas123!@#',
  server: 'securraiaas.database.windows.net',
  database: 'Securra_Iaas',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};
*/

const config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE!,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

// the below code has been comment as including of middelware and log, error handling

/*
app.get('/', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT TOP 10 * FROM Medical_App_User');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

*/

sql.connect(config)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB Connection Error:', err));

app.use(cors());
app.use(morganMiddleware);
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/packlog', packLogRoutes);
app.use('/api/vanchi', vanchiRoutes);
app.use('/api/valueset', valuesetRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
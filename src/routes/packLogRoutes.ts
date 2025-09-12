import { Router } from 'express';
import sql from 'mssql';

const router = Router();

// Insert a new pack log
router.post('/', async (req, res) => {
  const {
    sealDT, transNo, nada, vanchi, bagno, sealBy,
    receDT, receBy, packStatus, comments,
    createdBy, isActive
  } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO tdbPackLog (
        sealDT, transNo, nada, vanchi, bagno, sealBy,
        receDT, receBy, packStatus, comments,
        createdBy, isActive
      )
      OUTPUT inserted.*
      VALUES (
        ${sealDT}, ${transNo}, ${nada}, ${vanchi}, ${bagno}, ${sealBy},
        ${receDT}, ${receBy}, ${packStatus}, ${comments},
        ${createdBy}, ${isActive}
      )
    `;
    res.status(201).json(result.recordset[0]);
  } catch (err: any) {
    res.status(500).json({ message: 'Error inserting record', error: err.message });
  }
});

// Get all pack logs
router.get('/', async (req, res) => {
  try {
    const result = await sql.query`SELECT [packid]  ,[packSno]  ,FORMAT([sealDT],'dd-MM-yyyy HH:mm:ss') as [sealDT] ,[transNo]  ,[nada]  ,[vanchi]
  ,[bagno]  ,[sealBy]  ,FORMAT([receDT],'dd-MM-yyyy HH:mm:ss') as [receDT]  ,[receBy]  ,[packStatus]  ,[comments]
  ,[createdBy]  ,FORMAT([createAt],'dd-MM-yyyy HH:mm:ss') as [createAt]  ,[isActive]  ,[vanchiNo]
  FROM [dbo].[tdbPackLog] order by packSno desc`;
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching records', error: err.message });
  }
});

// Get records by sealDT (date only, format: YYYY-MM-DD)
router.get('/date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await sql.query`
      SELECT * FROM tdbPackLog
      WHERE CONVERT(date, sealDT) = ${date}
      ORDER BY sealDT DESC
    `;
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching records by date', error: err.message });
  }
});

// Get records by sealDT date range (format: YYYY-MM-DD)
router.get('/range', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ message: 'Start and end dates are required' });
  }
  try {
    const result = await sql.query`
      SELECT * FROM tdbPackLog
      WHERE CONVERT(date, sealDT) BETWEEN ${start} AND ${end}
      ORDER BY sealDT DESC
    `;
    res.json(result.recordset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching records by range', error: err.message });
  }
});

// --- New APIs by transNo ---
import {
  getPackLogByTransNo,
  updatePackLogByTransNo,
  deletePackLogByTransNo
} from '../controllers/packLogController';

// Get pack log(s) by transNo
router.get('/transno/:transNo', getPackLogByTransNo);

// Update pack log(s) by transNo
router.put('/transno/:transNo', updatePackLogByTransNo);

// Delete pack log(s) by transNo
router.delete('/transno/:transNo', deletePackLogByTransNo);

export default router;

// Remove incorrect self-import and usage here.
// The router is already exported from this file.
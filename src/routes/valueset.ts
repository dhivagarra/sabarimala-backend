import { Router } from 'express';
import pool from '../db';

const router = Router();

// 1. Create valueset
router.post('/', async (req, res) => {
  const {
    orgCode, orgName, categoryCode, categoryNameEn, categoryNameMl,
    parameterCode, parameterNameEn, parameterNameMl,
    valuesetCode, valuesetNameEn, valuesetNameMl, valuesetOrder,
    isactive, cretedby, createddt, modifiedby, modifieddt, modifiedat
  } = req.body;
  try {
    const insertQuery = `
      INSERT INTO tblvalueset (
        orgCode, orgName, categoryCode, categoryNameEn, categoryNameMl,
        parameterCode, parameterNameEn, parameterNameMl,
        valuesetCode, valuesetNameEn, valuesetNameMl, valuesetOrder,
        isactive, cretedby, createddt, modifiedby, modifieddt, modifiedat
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `;
    const values = [
      orgCode, orgName, categoryCode, categoryNameEn, categoryNameMl,
      parameterCode, parameterNameEn, parameterNameMl,
      valuesetCode, valuesetNameEn, valuesetNameMl, valuesetOrder,
      isactive || 'Y', cretedby, createddt, modifiedby, modifieddt, modifiedat
    ];
    const result = await pool.query(insertQuery, values);
    res.status(201).json({ valueset: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Valueset creation failed', details: err });
  }
});

// 2. Get all valueset
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tblvalueset');
    res.json({ rowCount: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch valueset', details: err });
  }
});

// 3. Get valueset by parameterCode or parameterNameEn
router.get('/param', async (req, res) => {
  const { parameterCode, parameterNameEn } = req.query;
  let query = 'SELECT valuesetCode, valuesetNameEn, valuesetNameMl, valuesetOrder FROM tblvalueset WHERE 1=1';
  const params = [];
  if (parameterCode) {
    query += ' AND parameterCode = $' + (params.length + 1);
    params.push(parameterCode);
  }
  if (parameterNameEn) {
    query += ' AND parameterNameEn = $' + (params.length + 1);
    params.push(parameterNameEn);
  }
  try {
    const result = await pool.query(query, params);
    res.json({ rowCount: result.rowCount, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch valueset by parameter', details: err });
  }
});

// 4. Update valueset using tblid
router.put('/:tblid', async (req, res) => {
  const { tblid } = req.params;
  const fields = [
    'orgCode', 'orgName', 'categoryCode', 'categoryNameEn', 'categoryNameMl',
    'parameterCode', 'parameterNameEn', 'parameterNameMl',
    'valuesetCode', 'valuesetNameEn', 'valuesetNameMl', 'valuesetOrder',
    'isactive', 'cretedby', 'createddt', 'modifiedby', 'modifieddt', 'modifiedat'
  ];
  const updates = [];
  const values = [];
  let idx = 1;
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${idx}`);
      values.push(req.body[field]);
      idx++;
    }
  }
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  values.push(tblid);
  const updateQuery = `UPDATE tblvalueset SET ${updates.join(', ')} WHERE tblid = $${idx} RETURNING *`;
  try {
    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Valueset not found' });
    } else {
      res.json({ valueset: result.rows[0] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update valueset', details: err });
  }
});

export default router;
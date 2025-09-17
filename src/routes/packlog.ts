import { Router } from 'express';
import pool from '../db';
import { TblPacklog } from '../types';

const router = Router();

// 1. Create record in tblpacklog
router.post('/', async (req, res) => {
	const {
		transno,
		nadacd,
		vanchicd,
		vanchino,
		bagno,
		packdt,
		packby,
        secguard,
		receivedt,
		receiveby,
		packstatus,
		packcomments,
		isactive,
		cretedby,
		createddt,
		modifiedby,
		modifieddt,
		modifiedat
	} = req.body;
	if (!transno || !nadacd || !vanchicd || !bagno || !packdt || !packby) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const insertQuery = `
			INSERT INTO tblpacklog (
				transno, nadacd, vanchicd, vanchino, bagno, packdt, packby, secguard, receivedt, receiveby, packstatus, packcomments, isactive, cretedby, createddt, modifiedby, modifieddt, modifiedat
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
			) RETURNING *
		`;
		const values = [
			transno, nadacd, vanchicd, vanchino || null, bagno, packdt, packby, secguard || null, receivedt || null, receiveby || null, packstatus || null, packcomments || null, isactive || 'Y', cretedby || null, createddt || null, modifiedby || null, modifieddt || null, modifiedat || null
		];
		const result = await pool.query<TblPacklog>(insertQuery, values);
		res.status(201).json({ packlog: result.rows[0] });
	} catch (err) {
		res.status(500).json({ error: 'Packlog creation failed', details: err });
	}
});

// 2. Get all records from tblpacklog
router.get('/', async (req, res) => {
	try {
        const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog ORDER BY tblid DESC');
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records', details: err });
	}
});

// 3. Get records from tblpacklog using transno
router.get('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE transno = $1 ORDER BY tblid DESC', [transno]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by transno', details: err });
	}
});

// 4. Get records from tblpacklog using packstatus
router.get('/packstatus/:packstatus', async (req, res) => {
	const { packstatus } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE packstatus = $1 ORDER BY tblid DESC', [packstatus]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by packstatus', details: err });
	}
});

// 5. Get record from tblpacklog using tblid
router.get('/tblid/:tblid', async (req, res) => {
	const { tblid } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE tblid = $1', [tblid]);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog record by tblid', details: err });
	}
});

// 6. Update record in tblpacklog using transno
router.put('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	// Only allow updating these columns
	const fields = [
		'receivedt', 'receiveby', 'packstatus', 'packcomments'
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
	values.push(transno);
	const updateQuery = `UPDATE tblpacklog SET ${updates.join(', ')} WHERE transno = $${idx} RETURNING *`;
	try {
		const result = await pool.query<TblPacklog>(updateQuery, values);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json({ packlog: result.rows[0] });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to update packlog record by transno', details: err });
	}
});

// 7. Update record in tblpacklog using tblid
router.put('/tblid/:tblid', async (req, res) => {
	const { tblid } = req.params;
	const fields = [
		'transno', 'nadacd', 'vanchicd', 'bagno', 'packdt', 'packby', 'secguard', 'receivedt', 'receiveby', 'packstatus', 'packcomments', 'isactive', 'cretedby', 'createddt', 'modifiedby', 'modifieddt', 'modifiedat'
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
	const updateQuery = `UPDATE tblpacklog SET ${updates.join(', ')} WHERE tblid = $${idx} RETURNING *`;
	try {
		const result = await pool.query<TblPacklog>(updateQuery, values);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json({ packlog: result.rows[0] });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to update packlog record by tblid', details: err });
	}
});


// 1. Create record in tblpacklog
// 2. Get all records from tblpacklog
router.get('/', async (req, res) => {
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog ORDER BY tblid DESC');
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records', details: err });
	}
});

// 3. Get records from tblpacklog using transno
router.get('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE transno = $1 ORDER BY tblid DESC', [transno]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by transno', details: err });
	}
});

// 4. Get records from tblpacklog using packstatus
router.get('/packstatus/:packstatus', async (req, res) => {
	const { packstatus } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE packstatus = $1 ORDER BY tblid DESC', [packstatus]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by packstatus', details: err });
	}
});

// 5. Get record from tblpacklog using tblid
router.get('/tblid/:tblid', async (req, res) => {
	const { tblid } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE tblid = $1', [tblid]);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog record by tblid', details: err });
	}
});

// 6. Update record in tblpacklog using transno
router.put('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	const fields = [
		'nadacd', 'vanchicd', 'bagno', 'packdt', 'packby', 'secguard', 'receivedt', 'receiveby', 'packstatus', 'packcomments', 'isactive', 'cretedby', 'createddt', 'modifiedby', 'modifieddt', 'modifiedat'
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
	values.push(transno);
	const updateQuery = `UPDATE tblpacklog SET ${updates.join(', ')} WHERE transno = $${idx} RETURNING *`;
	try {
		const result = await pool.query<TblPacklog>(updateQuery, values);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json({ packlog: result.rows[0] });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to update packlog record by transno', details: err });
	}
});

export default router;
// 6. Update record in tblpacklog using transno
router.put('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	const fields = [
		'nadacd', 'vanchicd', 'bagno', 'packdt', 'packby', 'secguard', 'receivedt', 'receiveby', 'packstatus', 'packcomments', 'isactive', 'cretedby', 'createddt', 'modifiedby', 'modifieddt', 'modifiedat'
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
	values.push(transno);
	const updateQuery = `UPDATE tblpacklog SET ${updates.join(', ')} WHERE transno = $${idx} RETURNING *`;
	try {
		const result = await pool.query<TblPacklog>(updateQuery, values);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json({ packlog: result.rows[0] });
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to update packlog record by transno', details: err });
	}
});
// 5. Get record from tblpacklog using tblid
router.get('/tblid/:tblid', async (req, res) => {
	const { tblid } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE tblid = $1', [tblid]);
		if (result.rows.length === 0) {
			res.status(404).json({ error: 'Packlog record not found' });
		} else {
			res.json(result.rows[0]);
		}
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog record by tblid', details: err });
	}
});
// 4. Get records from tblpacklog using packstatus
router.get('/packstatus/:packstatus', async (req, res) => {
	const { packstatus } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE packstatus = $1 ORDER BY tblid DESC', [packstatus]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by packstatus', details: err });
	}
});
// 3. Get records from tblpacklog using transno
router.get('/transno/:transno', async (req, res) => {
	const { transno } = req.params;
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog WHERE transno = $1 ORDER BY tblid DESC', [transno]);
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records by transno', details: err });
	}
});



// 1. Create record in tblpacklog
router.post('/', async (req, res) => {
	const {
		transno,
		nadacd,
		vanchicd,
		vanchino,
		bagno,
		packdt,
		packby,
		secguard,
		receivedt,
		receiveby,
		packstatus,
		packcomments,
		isactive,
		cretedby,
		createddt,
		modifiedby,
		modifieddt,
		modifiedat
	} = req.body;
	if (!transno || !nadacd || !vanchicd || !bagno || !packdt || !packby) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const insertQuery = `
			INSERT INTO tblpacklog (
				transno, nadacd, vanchicd, vanchino, bagno, packdt, packby, secguard, receivedt, receiveby, packstatus, packcomments, isactive, cretedby, createddt, modifiedby, modifieddt, modifiedat
			) VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
			) RETURNING *
		`;
		const values = [
			transno, nadacd, vanchicd, vanchino || null, bagno, packdt, packby, secguard || null, receivedt || null, receiveby || null, packstatus || null, packcomments || null, isactive || 'Y', cretedby || null, createddt || null, modifiedby || null, modifieddt || null, modifiedat || null
		];
		const result = await pool.query<TblPacklog>(insertQuery, values);
		res.status(201).json({ packlog: result.rows[0] });
	} catch (err) {
		res.status(500).json({ error: 'Packlog creation failed', details: err });
	}
});

// 2. Get all records from tblpacklog
router.get('/', async (req, res) => {
	try {
		const result = await pool.query<TblPacklog>('SELECT * FROM tblpacklog ORDER BY tblid DESC');
		res.json({ rowCount: result.rowCount, data: result.rows });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch packlog records', details: err });
	}
});



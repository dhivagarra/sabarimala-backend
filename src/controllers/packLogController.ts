export async function getPackLogByTransNo(req: Request, res: Response) {
  try {
    const packLogs = await packLogService.getPackLogByTransNo(req.params.transNo);
    if (!packLogs || packLogs.length === 0) return res.status(404).json({ message: 'Pack log not found' });
    res.json(packLogs);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching pack log by transNo', error: err.message });
  }
}

export async function updatePackLogByTransNo(req: Request, res: Response) {
  // Helper to convert ISO/any date string to 'YYYY-MM-DD HH:mm:ss' (no timezone)
  function toSqlDateTime(val: any) {
    if (!val) return null;
    // Accepts ISO or SQL string
    const d = new Date(val);
    if (isNaN(d.getTime())) return val; // fallback: return as is
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  // Normalize date fields if present
  const body = { ...req.body };
  if (body.sealDT) body.sealDT = toSqlDateTime(body.sealDT);
  if (body.receDT) body.receDT = toSqlDateTime(body.receDT);
  if (body.createAt) body.createAt = toSqlDateTime(body.createAt);

  try {
    const packLogs = await packLogService.updatePackLogByTransNo(req.params.transNo, body);
    res.json(packLogs);
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating pack log by transNo', error: err.message });
  }
}

export async function deletePackLogByTransNo(req: Request, res: Response) {
  try {
    await packLogService.deletePackLogByTransNo(req.params.transNo);
    res.json({ message: 'Pack log(s) deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting pack log by transNo', error: err.message });
  }
}
import { Request, Response } from 'express';
// Ensure the following file exists: ../services/packLogService.ts
// Update the path below if your service file is in a different location
// Update the path below if your service file is in a different location
import * as packLogService from '../services/packLogService';
// If the above import fails, check the actual path and update accordingly, e.g.:
// import * as packLogService from '../../services/packLogService';
// or
// import * as packLogService from './packLogService';

export async function createPackLog(req: Request, res: Response) {
  try {
    const packLog = await packLogService.createPackLog(req.body);
    res.status(201).json(packLog);
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating pack log', error: err.message });
  }
}

export async function getAllPackLogs(req: Request, res: Response) {
  try {
    const packLogs = await packLogService.getAllPackLogs();
    res.json(packLogs);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching pack logs', error: err.message });
  }
}

export async function getPackLogById(req: Request, res: Response) {
  try {
    const packLog = await packLogService.getPackLogById(req.params.packid);
    if (!packLog) return res.status(404).json({ message: 'Pack log not found' });
    res.json(packLog);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching pack log', error: err.message });
  }
}

export async function updatePackLog(req: Request, res: Response) {
  try {
    const packLog = await packLogService.updatePackLog(req.params.packid, req.body);
    res.json(packLog);
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating pack log', error: err.message });
  }
}

export async function deletePackLog(req: Request, res: Response) {
  try {
    await packLogService.deletePackLog(req.params.packid);
    res.json({ message: 'Pack log deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting pack log', error: err.message });
  }
}

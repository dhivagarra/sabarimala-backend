import { Request, Response } from 'express';
import * as vanchiService from '../services/vanchiService';

export async function createVanchi(req: Request, res: Response) {
  try {
    const vanchi = await vanchiService.createVanchi(req.body);
    res.status(201).json(vanchi);
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating vanchi', error: err.message });
  }
}

export async function getAllVanchi(req: Request, res: Response) {
  try {
    const vanchis = await vanchiService.getAllVanchi();
    res.json(vanchis);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching vanchis', error: err.message });
  }
}

export async function getVanchiById(req: Request, res: Response) {
  try {
    const vanchi = await vanchiService.getVanchiById(req.params.tbdId);
    if (!vanchi) return res.status(404).json({ message: 'Vanchi not found' });
    res.json(vanchi);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching vanchi', error: err.message });
  }
}

export async function updateVanchi(req: Request, res: Response) {
  try {
    const vanchi = await vanchiService.updateVanchi(req.params.tbdId, req.body);
    res.json(vanchi);
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating vanchi', error: err.message });
  }
}

export async function deleteVanchi(req: Request, res: Response) {
  try {
    await vanchiService.deleteVanchi(req.params.tbdId);
    res.json({ message: 'Vanchi deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting vanchi', error: err.message });
  }
}

import { Request, Response } from 'express';
import * as valuesetService from '../services/valuesetService';

export async function createValueset(req: Request, res: Response) {
  try {
    const valueset = await valuesetService.createValueset(req.body);
    res.status(201).json(valueset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating valueset', error: err.message });
  }
}

export async function getAllValuesets(req: Request, res: Response) {
  try {
    const valuesets = await valuesetService.getAllValuesets();
    res.json(valuesets);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching valuesets', error: err.message });
  }
}

export async function getValuesetById(req: Request, res: Response) {
  try {
    const valueset = await valuesetService.getValuesetById(req.params.tbdId);
    if (!valueset) return res.status(404).json({ message: 'Valueset not found' });
    res.json(valueset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching valueset', error: err.message });
  }
}

export async function updateValueset(req: Request, res: Response) {
  try {
    const valueset = await valuesetService.updateValueset(req.params.tbdId, req.body);
    res.json(valueset);
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating valueset', error: err.message });
  }
}

export async function deleteValueset(req: Request, res: Response) {
  try {
    await valuesetService.deleteValueset(req.params.tbdId);
    res.json({ message: 'Valueset deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting valueset', error: err.message });
  }
}

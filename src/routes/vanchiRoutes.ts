import { Router } from 'express';
import {
  createVanchi,
  getAllVanchi,
  getVanchiById,
  updateVanchi,
  deleteVanchi
} from '../controllers/vanchiController';

const router = Router();

// Create
router.post('/', createVanchi);
// Read all
router.get('/', getAllVanchi);
// Read by id
router.get('/:tbdId', getVanchiById);
// Update
router.put('/:tbdId', updateVanchi);
// Delete
router.delete('/:tbdId', deleteVanchi);

export default router;

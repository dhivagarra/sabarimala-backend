import { Router } from 'express';
import {
  createValueset,
  getAllValuesets,
  getValuesetById,
  updateValueset,
  deleteValueset
} from '../controllers/valuesetController';

const router = Router();

router.post('/', createValueset);
router.get('/', getAllValuesets);
router.get('/:tbdId', getValuesetById);
router.put('/:tbdId', updateValueset);
router.delete('/:tbdId', deleteValueset);

export default router;

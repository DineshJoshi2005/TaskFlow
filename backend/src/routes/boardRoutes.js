import express from 'express';
import BoardController from '../controllers/boardController.js';

const router = express.Router();

router.get('/:id', BoardController.getBoard);
router.get('/:id/counts', BoardController.getColumnCounts);

export default router;

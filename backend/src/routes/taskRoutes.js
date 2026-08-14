import express from 'express';
import TaskController from '../controllers/taskController.js';

const router = express.Router();

router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id/move', TaskController.moveTask);
router.delete('/:id', TaskController.deleteTask);

export default router;

import TaskModel from '../models/taskModel.js';

const TaskController = {
  getTasks(req, res, next) {
    try {
      const { priority, search } = req.query;
      let tasks;

      if (search && search.trim() !== '') {
        tasks = TaskModel.searchTasks(search.trim());
      } else if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
        tasks = TaskModel.getTasksByPriority(priority);
      } else {
        tasks = TaskModel.getAllTasks();
      }

      res.status(200).json({
        success: true,
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  },

  getTaskById(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const task = TaskModel.getTaskById(taskId);

      if (!task) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${taskId} not found.`
        });
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  createTask(req, res, next) {
    try {
      const { column_id, title, description, priority } = req.body;

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Task title is required and cannot be empty.'
        });
      }

      if (!column_id || isNaN(parseInt(column_id, 10))) {
        return res.status(400).json({
          success: false,
          error: 'A valid column_id is required.'
        });
      }

      const validPriorities = ['Low', 'Medium', 'High'];
      const validatedPriority = validPriorities.includes(priority) ? priority : 'Medium';

      const newTask = TaskModel.createTask({
        column_id: parseInt(column_id, 10),
        title,
        description,
        priority: validatedPriority
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully.',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  },

  updateTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const { title, description, priority } = req.body;

      const existingTask = TaskModel.getTaskById(taskId);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${taskId} not found.`
        });
      }

      if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Task title is required and cannot be empty.'
        });
      }

      const validPriorities = ['Low', 'Medium', 'High'];
      const validatedPriority = validPriorities.includes(priority) ? priority : existingTask.priority;

      const updatedTask = TaskModel.updateTask(taskId, {
        title,
        description,
        priority: validatedPriority
      });

      res.status(200).json({
        success: true,
        message: 'Task updated successfully.',
        data: updatedTask
      });
    } catch (error) {
      next(error);
    }
  },

  moveTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const { column_id } = req.body;

      if (!column_id || isNaN(parseInt(column_id, 10))) {
        return res.status(400).json({
          success: false,
          error: 'A valid target column_id is required.'
        });
      }

      const existingTask = TaskModel.getTaskById(taskId);
      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${taskId} not found.`
        });
      }

      const movedTask = TaskModel.moveTaskColumn(taskId, parseInt(column_id, 10));

      res.status(200).json({
        success: true,
        message: 'Task moved successfully.',
        data: movedTask
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      const existingTask = TaskModel.getTaskById(taskId);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: `Task with ID ${taskId} not found.`
        });
      }

      TaskModel.deleteTask(taskId);

      res.status(200).json({
        success: true,
        message: `Task with ID ${taskId} deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
};

export default TaskController;

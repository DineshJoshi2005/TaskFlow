import request from 'supertest';
import app from '../src/app.js';
import { db, initDb } from '../database/db.js';
import BoardModel from '../src/models/boardModel.js';
import TaskModel from '../src/models/taskModel.js';

describe('TaskFlow Backend API & Database Tests', () => {
  beforeEach(() => {
    initDb();
  });

  afterAll(() => {
    db.close();
  });

  describe('1. Validation: Task Creation', () => {
    test('Creating a task with no title fails with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          column_id: 1,
          title: '',
          description: 'This should fail because title is empty',
          priority: 'Medium'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/Task title is required/i);
    });

    test('Creating a task with whitespace-only title fails with HTTP 400', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          column_id: 1,
          title: '   ',
          description: 'Whitespace title'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('Creating a valid task succeeds with HTTP 201', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          column_id: 1,
          title: 'Write integration test',
          description: 'Comprehensive test coverage',
          priority: 'High'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Write integration test');
      expect(response.body.data.priority).toBe('High');
      expect(response.body.data.column_id).toBe(1);
    });
  });

  describe('2. Task Movement', () => {
    test('Moving a task updates its column_id correctly', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({
          column_id: 1,
          title: 'Task to move',
          priority: 'Low'
        });

      const taskId = createRes.body.data.id;
      expect(createRes.body.data.column_id).toBe(1);

      const moveRes = await request(app)
        .patch(`/api/tasks/${taskId}/move`)
        .send({
          column_id: 2
        });

      expect(moveRes.status).toBe(200);
      expect(moveRes.body.success).toBe(true);
      expect(moveRes.body.data.column_id).toBe(2);

      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.data.column_id).toBe(2);
    });
  });

  describe('3. Direct Database Layer Tests', () => {
    test('Direct DB Query: getTaskCountPerColumn returns accurate counts for seed data', () => {
      const counts = BoardModel.getTaskCountPerColumn(1);

      expect(Array.isArray(counts)).toBe(true);
      expect(counts.length).toBe(3);

      const todoColumn = counts.find(c => c.column_name === 'To Do');
      const inProgressColumn = counts.find(c => c.column_name === 'In Progress');
      const doneColumn = counts.find(c => c.column_name === 'Done');

      expect(todoColumn).toBeDefined();
      expect(todoColumn.task_count).toBeGreaterThanOrEqual(2);

      expect(inProgressColumn).toBeDefined();
      expect(inProgressColumn.task_count).toBeGreaterThanOrEqual(2);

      expect(doneColumn).toBeDefined();
      expect(doneColumn.task_count).toBeGreaterThanOrEqual(1);
    });

    test('Direct DB Query: getTasksByPriority returns tasks filtered and sorted newest first', () => {
      const highPriorityTasks = TaskModel.getTasksByPriority('High');

      expect(Array.isArray(highPriorityTasks)).toBe(true);
      expect(highPriorityTasks.length).toBeGreaterThanOrEqual(3);

      highPriorityTasks.forEach(task => {
        expect(task.priority).toBe('High');
      });

      for (let i = 0; i < highPriorityTasks.length - 1; i++) {
        const currentDate = new Date(highPriorityTasks[i].created_at).getTime();
        const nextDate = new Date(highPriorityTasks[i + 1].created_at).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe('4. Task Editing & Deletion', () => {
    test('Editing a task updates its fields', async () => {
      const updateRes = await request(app)
        .put('/api/tasks/1')
        .send({
          title: 'Updated Test Title',
          description: 'Updated Description',
          priority: 'High'
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.title).toBe('Updated Test Title');
      expect(updateRes.body.data.priority).toBe('High');
    });

    test('Deleting a task removes it', async () => {
      const deleteRes = await request(app).delete('/api/tasks/1');
      expect(deleteRes.status).toBe(200);

      const getRes = await request(app).get('/api/tasks/1');
      expect(getRes.status).toBe(404);
    });
  });
});

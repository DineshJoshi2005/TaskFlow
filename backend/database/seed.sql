INSERT INTO boards (id, name) VALUES (1, 'TaskFlow Project Board');

INSERT INTO columns (id, board_id, name, order_index) VALUES 
(1, 1, 'To Do', 0),
(2, 1, 'In Progress', 1),
(3, 1, 'Done', 2);

INSERT INTO tasks (id, column_id, title, description, priority, created_at) VALUES
(1, 1, 'Write unit & integration tests', 'Test validation for empty titles, moving tasks, and database queries.', 'Medium', datetime('now', '-3 hours')),
(2, 1, 'Prepare README.md documentation', 'Document setup instructions, schema, SQL queries, and design decisions.', 'Low', datetime('now', '-2 hours')),
(3, 2, 'Design database schema with SQLite', 'Include primary keys, foreign keys, not-null constraints, and data types.', 'High', datetime('now', '-5 hours')),
(4, 2, 'Implement React frontend with search & filters', 'Create responsive board, priority filters, task search, and task cards.', 'High', datetime('now', '-4 hours')),
(5, 3, 'Setup Express API with MVC architecture', 'Build modular routes, controllers, and models with pure SQL queries.', 'High', datetime('now', '-6 hours'));

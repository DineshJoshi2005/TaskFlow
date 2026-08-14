# TaskFlow — Team Task Board

**TaskFlow** is a lightweight, responsive full-stack task board built for small teams (inspired by Trello). It allows teams to organize their workflow into columns, create, edit, move, and delete tasks, filter tasks by priority, search by title in real-time, and view column task metrics.

Built with **React (JavaScript)** on the frontend, **Node.js (Express)** following the **MVC (Model-View-Controller)** pattern on the backend, and **SQLite** for pure SQL relational data persistence.

---

## 🌐 Live Deployment Links

- 🚀 **Live Frontend Application (Vercel)**: [https://task-flow-cyan-omega.vercel.app/](https://task-flow-cyan-omega.vercel.app/)
- ⚙️ **Live Backend API (Render)**: [https://taskflow-pwun.onrender.com](https://taskflow-pwun.onrender.com)
- 🩺 **API Health Check**: [https://taskflow-pwun.onrender.com/api/health](https://taskflow-pwun.onrender.com/api/health)

---

## 🚀 Features

- 📋 **Kanban Board View**: View boards with categorized columns (*To Do*, *In Progress*, *Done*).
- ➕ **Task Management**: Create tasks with titles (required), optional descriptions, and priority levels (*Low*, *Medium*, *High*).
- ✏️ **Edit & Delete**: Edit task details in a dedicated modal or delete completed/unneeded tasks.
- 🔄 **Move Between Columns**: Move tasks across columns instantly via clean dropdown selector controls on each card.
- 🎯 **Priority Filtering**: Filter visible tasks by priority (*All*, *High*, *Medium*, *Low*).
- 🔍 **Title Search (Stretch Goal)**: Real-time search to find tasks by keyword.
- 🔢 **Column Task Counter (Stretch Goal)**: Live task count badge displayed in each column header.
- 🌓 **Dark & Light Mode**: Seamless theme toggle with persistent user preference in `localStorage`.
- 🛡️ **Validation & Error Handling**: Server-side and client-side validation preventing empty titles, with informative error banners and retry actions.
- 💾 **Data Persistence**: Backed by SQLite; all state persists across browser reloads.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Vanilla CSS with custom properties / design system, Lucide icons.
- **Backend**: Node.js, Express.js, `better-sqlite3`, CORS, Dotenv.
- **Database**: SQLite3 (relational schema with foreign keys and cascading deletes).
- **Architecture**: **MVC (Model-View-Controller)**:
  - **Models (`backend/src/models/`)**: Pure SQL queries and database interaction.
  - **Controllers (`backend/src/controllers/`)**: Business logic, input validation, and HTTP response handling.
  - **Routes (`backend/src/routes/`)**: Clean RESTful endpoint definitions.
  - **Views (`frontend/src/`)**: Component-based React UI.
- **Testing**: Jest + Supertest for backend validation, column movement, and direct database queries.

---

## 📦 Project Structure

```
TaskFlow/
├── .gitignore
├── README.md
├── package.json               # Root scripts to run both servers concurrently
├── backend/
│   ├── package.json
│   ├── database/
│   │   ├── schema.sql         # CREATE TABLE with types, PKs, FKs, NOT NULL
│   │   ├── seed.sql           # Initial sample board, columns, and tasks
│   │   └── db.js              # SQLite connection & database initialization
│   ├── src/
│   │   ├── app.js             # Express app configuration & middlewares
│   │   ├── server.js          # Server entry point (Port 5000)
│   │   ├── models/            # [M] Data Access Layer (Pure SQL)
│   │   │   ├── boardModel.js
│   │   │   └── taskModel.js
│   │   ├── controllers/       # [C] Request validation & handlers
│   │   │   ├── boardController.js
│   │   │   └── taskController.js
│   │   └── routes/            # Route definitions
│   │       ├── boardRoutes.js
│   │       └── taskRoutes.js
│   └── tests/
│       └── tasks.test.js      # Jest + Supertest test suite
└── frontend/                  # [V] React View Layer
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx            # Main app container managing state & filters
        ├── App.css            # Clean, modern stylesheet
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx     # Header with search, priority filter, & Add button
        │   ├── Board.jsx      # Columns grid container
        │   ├── Column.jsx     # Column with count badge & task list
        │   ├── TaskCard.jsx   # Task card with priority tag, move dropdown & actions
        │   ├── TaskModal.jsx  # Task creation/editing modal dialog
        │   └── Alert.jsx      # Friendly error alert banner
        └── services/
            └── api.js         # Centralized API fetch wrapper
```

---

## ⚡ Setup & Run Instructions (from a Fresh Clone)

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Option 1: Quick Start (Run Both Concurrently from Root)

1. **Install root & workspace dependencies**:
   ```bash
   npm install
   npm run install:all
   ```

2. **Start both Backend and Frontend in development mode**:
   ```bash
   npm run dev
   ```
   - **Backend Server**: http://localhost:5000
   - **Frontend App**: http://localhost:5173

---

### Option 2: Step-by-Step (Separate Terminals)

#### Terminal 1 — Backend:
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000`)*

#### Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🧪 Running Automated Tests

To execute the backend automated test suite (testing empty title rejection, column moving, and direct database queries):

```bash
# From the root directory:
npm test

# OR directly inside the backend directory:
cd backend
npm test
```

---

## 🗄️ Database Schema (`schema.sql`)

The application uses a clean relational schema with primary keys, foreign keys with cascading deletions, and constraints:

```sql
-- Enable foreign key support in SQLite
PRAGMA foreign_keys = ON;

-- 1. Boards Table
CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Columns Table (Foreign key -> boards)
CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- 3. Tasks Table (Foreign key -> columns)
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) NOT NULL DEFAULT 'Medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);
```

---

## 🔍 Required Database Queries (Section 2.5)

Rather than fetching all records and filtering in JavaScript memory, the application uses pure SQL queries:

### Query 1: Count of Tasks Per Column on a Board
Located in [`backend/src/models/boardModel.js`](backend/src/models/boardModel.js):
```sql
SELECT 
  c.id AS column_id, 
  c.name AS column_name, 
  c.order_index, 
  COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t ON c.id = t.column_id
WHERE c.board_id = ?
GROUP BY c.id, c.name, c.order_index
ORDER BY c.order_index ASC;
```
> **Note**: Uses `LEFT JOIN` so columns with 0 tasks are still included in the result with a count of `0`.

### Query 2: Tasks with a Given Priority, Newest First
Located in [`backend/src/models/taskModel.js`](backend/src/models/taskModel.js):
```sql
SELECT t.*, c.name AS column_name
FROM tasks t
JOIN columns c ON t.column_id = c.id
WHERE t.priority = ?
ORDER BY t.created_at DESC;
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/boards/:id` | Fetch board with nested columns and tasks |
| `GET` | `/api/boards/:id/counts` | Fetch task counts grouped by column (Query #1) |
| `GET` | `/api/tasks` | Fetch tasks (supports `?priority=High` or `?search=title`) |
| `GET` | `/api/tasks/:id` | Fetch a single task by ID |
| `POST` | `/api/tasks` | Create a new task (`title` required, `column_id`, `priority`, `description`) |
| `PUT` | `/api/tasks/:id` | Update an existing task (`title`, `description`, `priority`) |
| `PATCH` | `/api/tasks/:id/move` | Move a task to a different column (`column_id`) |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

## 📝 Design Decisions, Assumptions & Learnings (Submission Section 6)

### 1. Decisions and Assumptions Made
- **Dropdown Movement vs Drag-and-Drop**: As recommended in the scenario, moving tasks via an explicit column dropdown on each card was chosen over drag-and-drop. This guarantees robust touch/mobile and keyboard accessibility, zero race conditions on fast column switches, and 100% reliable state synchronization with the backend.
- **Pure SQL vs ORM**: Pure SQL queries were used in SQLite instead of heavy ORMs (like Prisma or TypeORM) to demonstrate foundational SQL proficiency, proper constraint handling (`NOT NULL`, `CHECK`, foreign key cascades), and query optimization (`LEFT JOIN` with `GROUP BY`).
- **MVC Architecture**: Backend routes, controllers, and models are cleanly separated to make the codebase maintainable, testable in isolation, and easy for any new developer to navigate.
- **Frontend State Management**: Built with native React hooks (`useState`, `useEffect`, `useCallback`) and clean unidirectional data flow instead of adding complex boilerplate libraries like Redux.

### 2. What I'd Improve or Add with More Time
- **Optimistic UI Updates**: Immediately update the UI card positions while the API call is in flight, with automated rollback if the request fails.
- **Task Reordering within Columns**: Add an `order_index` column on `tasks` to allow manual sorting within the same column.
- **Task Activity / Audit Log**: Record a history log of state changes (e.g., *"Task moved from To Do to In Progress at 11:30 AM"*).
- **Due Dates & Labels**: Support due dates with visual badges for upcoming or overdue tasks.

### 3. Roughly How Long Spent
- **Total Time**: Approximately **3.5 to 4 hours** (Database schema & seeding, Express MVC backend setup, REST API controllers and validators, Jest tests, React UI components and responsive styling, and comprehensive documentation).

### 4. One Thing Learned / Found Interesting
- Using SQLite's `better-sqlite3` synchronous prepared statements in an Express MVC model layer provides a remarkably clean, readable syntax that eliminates callback hell without needing complex async wrappers, while `PRAGMA foreign_keys = ON;` provides strict relational integrity.

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import Alert from './components/Alert';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [board, setBoard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('taskflow-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState(1);

  const loadBoardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getBoard(1);
      if (response.success && response.data) {
        setBoard(response.data);
      }
    } catch (err) {
      console.error('Error fetching board:', err);
      setError(err.message || 'Unable to connect to the backend server. Please make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  const handleOpenCreateModal = (columnId = 1) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setDefaultColumnId(task.column_id);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskFormData) => {
    if (taskFormData.id) {
      await api.updateTask(taskFormData.id, {
        title: taskFormData.title,
        description: taskFormData.description,
        priority: taskFormData.priority
      });
    } else {
      await api.createTask({
        column_id: taskFormData.column_id,
        title: taskFormData.title,
        description: taskFormData.description,
        priority: taskFormData.priority
      });
    }
    await loadBoardData();
  };

  const handleMoveTask = async (taskId, newColumnId) => {
    try {
      setError(null);
      await api.moveTask(taskId, newColumnId);
      await loadBoardData();
    } catch (err) {
      console.error('Error moving task:', err);
      setError(err.message || 'Failed to move task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError(null);
        await api.deleteTask(taskId);
        await loadBoardData();
      } catch (err) {
        console.error('Error deleting task:', err);
        setError(err.message || 'Failed to delete task.');
      }
    }
  };

  const getFilteredBoard = () => {
    if (!board || !board.columns) return null;

    const filteredColumns = board.columns.map((column) => {
      const filteredTasks = (column.tasks || []).filter((task) => {
        const matchesPriority =
          selectedPriority === 'All' || task.priority === selectedPriority;

        const matchesSearch =
          searchTerm.trim() === '' ||
          task.title.toLowerCase().includes(searchTerm.toLowerCase().trim());

        return matchesPriority && matchesSearch;
      });

      return {
        ...column,
        tasks: filteredTasks
      };
    });

    return {
      ...board,
      columns: filteredColumns
    };
  };

  const filteredBoard = getFilteredBoard();

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onOpenCreateModal={handleOpenCreateModal}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <Alert
        message={error}
        onRetry={loadBoardData}
        onDismiss={() => setError(null)}
      />

      <main className="main-content">
        {isLoading && !board ? (
          <div className="board-loading">
            <p>Loading your board...</p>
          </div>
        ) : (
          <Board
            board={filteredBoard}
            onAddTask={handleOpenCreateModal}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
          />
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        defaultColumnId={defaultColumnId}
        columns={board?.columns || []}
      />
    </div>
  );
}

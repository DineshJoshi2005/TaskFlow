import React from 'react';
import { Kanban, Search, Plus, Filter, X, Sun, Moon } from 'lucide-react';

export default function Navbar({
  searchTerm,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  onOpenCreateModal,
  theme,
  onToggleTheme
}) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Kanban size={22} className="brand-icon" />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <span className="brand-subtitle">Team Task Board</span>
          </div>
        </div>

        <div className="navbar-controls">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => onSearchChange('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filter-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              className="priority-filter-select"
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              aria-label="Filter tasks by priority"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <button
            className="btn-theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-primary btn-create-task"
            onClick={() => onOpenCreateModal(1)}
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}

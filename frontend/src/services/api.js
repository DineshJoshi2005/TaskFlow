const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://taskflow-pwun.onrender.com/api');


async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  async getBoard(boardId = 1) {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`);
    return handleResponse(res);
  },

  async getColumnCounts(boardId = 1) {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/counts`);
    return handleResponse(res);
  },

  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.priority && params.priority !== 'All') {
      query.append('priority', params.priority);
    }
    if (params.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    const url = `${API_BASE_URL}/tasks${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async updateTask(taskId, taskData) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async moveTask(taskId, columnId) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column_id: columnId })
    });
    return handleResponse(res);
  },

  async deleteTask(taskId) {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  }
};

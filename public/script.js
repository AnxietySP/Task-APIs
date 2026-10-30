const API_URL = 'http://localhost:3000/tasks';


const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusSelect = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const taskList = document.getElementById('task-list');
const errorBanner = document.getElementById('error-banner');

async function fetchTasks() {
  try {
    hideError();
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (err) {
    showError(`Could not load tasks: ${err.message}`);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<p style="text-align:center; color:#64748b;">No tasks found.</p>';
    return;
  }

  tasks.forEach(task => {
    const isCompleted = task.status === 'completed' || task.completed == 1;
    const item = document.createElement('div');
    item.className = `task-item ${isCompleted ? 'completed-item' : ''}`;

    const formattedStatus = (task.status || 'pending').replace('_', ' ');

    item.innerHTML = `
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <span class="badge ${task.status}">${formattedStatus}</span>
      </div>
      <div class="task-actions">
        <button class="btn-edit" onclick="startEdit(${task.id}, '${escapeQuote(task.title)}', '${escapeQuote(task.description || '')}', '${task.status}')">Edit</button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(item);
  });
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = taskIdInput.value;
  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusSelect.value,
    completed: statusSelect.value === 'completed' ? 1 : 0
  };

  try {
    hideError();
    let response;
    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    resetForm();
    fetchTasks();
  } catch (err) {
    showError(`Could not save task: ${err.message}`);
  }
});

function startEdit(id, title, description, status) {
  taskIdInput.value = id;
  titleInput.value = title;
  descriptionInput.value = description;
  statusSelect.value = status || 'pending';

  submitBtn.textContent = 'Update Task';
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', resetForm);

function resetForm() {
  taskIdInput.value = '';
  taskForm.reset();
  submitBtn.textContent = 'Add Task';
  cancelBtn.hidden = true;
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    hideError();
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    fetchTasks();
  } catch (err) {
    showError(`Could not delete task: ${err.message}`);
  }
}

function showError(msg) {
  errorBanner.textContent = msg;
  errorBanner.hidden = false;
}

function hideError() {
  errorBanner.hidden = true;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[match]));
}

function escapeQuote(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

fetchTasks();

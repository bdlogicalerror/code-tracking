import { TaskManager } from './taskManager.js';
import { App } from './app.js';
export class UI {
    static displayTasks() {
        const tasks = TaskManager.getAllTasks();
        const tableBody = document.getElementById('all-tasks-body');
        tableBody.innerHTML = '';

        tasks.forEach(task => {
            UI.addTaskToTable(task);
        });
    }

    static addTaskToTable(task) {
        const tableBody = document.getElementById('all-tasks-body');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.description}</td>
            <td>${task.category}</td>
            <td>${new Date(task.dueDate).toLocaleString()}</td>
            <td>${task.priority}</td>
            <td>${task.completed ? 'Completed' : 'Pending'}</td>
            <td>
                <button class="btn complete-btn btn-sm ${task.completed ? 'disabled' : ''}" 
                        data-action="complete" 
                        data-task-id="${task.id}"
                        ${task.completed ? 'disabled' : ''}>
                    Complete
                </button>
                <button class="btn priority-btn btn-sm" 
                        data-action="priority" 
                        data-task-id="${task.id}">
                    Change Priority
                </button>
                <button class="btn delete-btn btn-sm" 
                        data-action="delete" 
                        data-task-id="${task.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    }

    static showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Task Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    static updateDigitalClock() {
        const clock = document.getElementById('digitalClock');
        const now = new Date();
        clock.textContent = now.toLocaleString();
    }

    static clearForm() {
        document.getElementById('taskForm').reset();
    }
}
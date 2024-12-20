import { TaskManager } from './taskManager.js';
import { UI } from './ui.js';

window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine:', lineNo, '\nColumn:', columnNo, '\nError object:', error);
    return false;
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});
export class App {
    static async init() {
        // Initialize the application
        await TaskManager.fetchInitialData();
        TaskManager.loadTasks();
        UI.displayTasks();

        // Set up interval timers
        setInterval(() => UI.updateDigitalClock(), 1000);
        setInterval(() => TaskManager.checkDueTasks(), 60000); // Check every minute

        // Initialize event listeners
        this.setupEventListeners();
    }

    static setupEventListeners() {
        // Add event delegation for task actions
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON' && target.dataset.action) {
                const taskId = target.dataset.taskId;
                const action = target.dataset.action;

                switch (action) {
                    case 'complete':
                        this.toggleTaskComplete(taskId);
                        break;
                    case 'priority':
                        this.changePriority(taskId);
                        break;
                    case 'delete':
                        this.deleteTask(taskId);
                        break;
                }
            }
        });
        // Add Task Form
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Category change handler
        document.getElementById('taskCategory').addEventListener('change', (e) => {
            const category = e.target.value;
            document.getElementById('personalFields').style.display =
                category === 'personal' ? 'block' : 'none';
            document.getElementById('workFields').style.display =
                category === 'work' ? 'block' : 'none';
        });
    }

    static handleAddTask() {
        const description = document.getElementById('taskDescription').value;
        const category = document.getElementById('taskCategory').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.getElementById('taskPriority').value;

        let task;
        if (category === 'personal') {
            const duration = document.getElementById('taskDuration').value;
            const notes = document.getElementById('taskNotes').value;
            task = new PersonalTask(description, dueDate, priority, duration, notes);
        } else {
            const project = document.getElementById('taskProject').value;
            const assignee = document.getElementById('taskAssignee').value;
            task = new WorkTask(description, dueDate, priority, project, assignee);
        }

        TaskManager.addTask(task);
        UI.displayTasks();
        UI.clearForm();
        $('#addTaskModal').modal('hide');
    }

    static async toggleTaskComplete(taskId) {
        const task = TaskManager.getTaskById(taskId);
        if (task) {
            task.complete();
            TaskManager.saveTasks();
            UI.displayTasks();
            UI.showToast('Task completed successfully');
        }
    }

    static async changePriority(taskId) {
        const task = TaskManager.getTaskById(taskId);
        if (task) {
            const newPriority = prompt('Enter new priority (low/medium/high):');
            if (['low', 'medium', 'high'].includes(newPriority)) {
                task.changePriority(newPriority);
                TaskManager.saveTasks();
                UI.displayTasks();
            }
        }
    }

    static async deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            TaskManager.deleteTask(taskId);
            UI.displayTasks();
        }
    }
}

// Export App class if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => App.init());
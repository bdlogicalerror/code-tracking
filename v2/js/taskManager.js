import { UI } from './ui.js';
import { PersonalTask, WorkTask } from './model/Task.js';
export class TaskManager {
    static tasks = [];

    static async fetchInitialData() {
        try {
            const [personalTasks, workTasks] = await Promise.all([
                fetch('http://backend.restapi.co.za/items/ptasks').then(res => res.json()),
                fetch('http://backend.restapi.co.za/items/wtasks').then(res => res.json())
            ]);

            // Convert API data to task objects
            personalTasks.data.forEach(task => {
                    console.log(  `${'personal_' +    task.id}`,
                        task.description,
                        task.priority,
                        task.duration,
                        task.notes)
                    this.tasks.push(new PersonalTask(
                        `${'personal_' +    task.id}`,
                        task.description,
                        task.priority,
                        task.duration,
                        task.notes
                    ));
                });
         // Convert API data to task objects
            workTasks.data.forEach(task => {
                console.log(task);
                this.tasks.push(new WorkTask(
                    `${'work_' + task.id}`,
                    task.description,
                    task.dueDate,
                    task.priority,
                    task.project,
                    task.assignee
                ));
            });
            this.saveTasks();
        } catch (error) {
            console.error('Error fetching initial data:', error);
            UI.showToast('Failed to load initial tasks', 'error');
        }
    }

    static getAllTasks() {
        return this.tasks;
    }

    static addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
    }

    static deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    static getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    static saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    static loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks).map(task => { 
                if (task.category === 'personal') {
                    return new PersonalTask(
                        task.description,
                        task.dueDate,
                        task.priority,
                        task.duration,
                        task.notes
                    );
                } else {
                    return new WorkTask(
                        task.description,
                        task.dueDate,
                        task.priority,
                        task.project,
                        task.assignee
                    );
                }
            });
        }
    }

    static checkDueTasks() {
        const now = new Date();
        this.tasks.forEach(task => {
            if (task.completed) return;

            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff <= 1 && hoursDiff > 0) {
                UI.showToast(
                    `Task "${task.description}" is due in less than an hour!`,
                    'due-soon'
                );
            } else if (hoursDiff < 0 && hoursDiff > -1) {
                UI.showToast(
                    `Task "${task.description}" is overdue!`,
                    'overdue'
                );
            }
        });
    }
}

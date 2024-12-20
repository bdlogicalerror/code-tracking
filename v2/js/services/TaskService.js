export class TaskService {
    constructor() {
        this.personalTasksEndpoint = 'http://backend.restapi.co.za/items/ptasks';
        this.workTasksEndpoint = 'http://backend.restapi.co.za/items/wtasks';
    }

    async fetchInitialData() {
        try {
            const [personalTasks, workTasks] = await Promise.all([
                fetch(this.personalTasksEndpoint).then(res => res.json()),
                fetch(this.workTasksEndpoint).then(res => res.json())
            ]);

            return {
                personalTasks: personalTasks,
                workTasks: workTasks
            };
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    async addTask(task) {
        const endpoint = task.category === 'personal' 
            ? this.personalTasksEndpoint 
            : this.workTasksEndpoint;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }

}
// Base Task class
export class Task {
    constructor(id,description, dueDate, priority) {
        this.id =id;
        this.description = description;
        this.completed = false;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
    }

    complete() {
        this.completed = true;
    }

    changePriority(newPriority) {
        this.priority = newPriority;
    }
}

// Personal Task class
export class PersonalTask extends Task {
    constructor(id,description, priority, duration, notes) {
        super(id,description, priority);
        this.category = 'personal';
        this.duration = duration;
        this.notes = notes;
    }
    
}

// Work Task class
export class WorkTask extends Task {
    constructor(id,description, dueDate, priority, project, assignee) {
        super(id,description, dueDate, priority);
        this.category = 'work';
        this.project = project;
        this.assignee = assignee;
    }
}
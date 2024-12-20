// Task Class
class Task {
    constructor(description, dueDate, priority) {
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.completed = false;
    }
}

// PersonalTask Class
class PersonalTask extends Task {
    constructor(description, dueDate, duration, priority, notes) {
        super(description, dueDate, priority);
        this.category = "Personal";
        this.duration = duration;
        this.notes = notes;
    }
}

// WorkTask Class
class WorkTask extends Task {
    constructor(description, dueDate, priority, project, assignee) {
        super(description, dueDate, priority);
        this.category = "Work";
        this.project = project;
        this.assignee = assignee;
    }
}

// TaskManager
class TaskManager {
    constructor() {
        this.tasks = [];
        this.renderTasks();
    }

    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        showToast("Task added successfully!", "success");
    }

    deleteTask(index) {
        if (confirm("Are you sure you want to delete this task?")) {
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.renderTasks();
            showToast("Task deleted successfully!", "danger");
        }
    }

    markAsCompleted(index) {
        if (confirm("Mark this task as completed?")) {
            this.tasks[index].completed = true;
            this.saveTasks();
            this.renderTasks();
            showToast("Task marked as completed!", "success");
        }
    }

    updateTaskPriority(index, newPriority) {
        this.tasks[index].priority = newPriority;
        this.saveTasks();
        this.renderTasks();
        showToast("Task priority updated!", "success");
    }

    renderTasks() {
        const taskTableBody = document.getElementById("taskTableBody");
        if (!taskTableBody) {
            console.error("taskTableBody element not found.");
            return;
        }
        taskTableBody.innerHTML = "";

        this.tasks.forEach((task, index) => {
            console.log(task);
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${task.category}</td>
          <td>${task.description}</td>
          <td>${task.dueDate.toLocaleString()}</td>
          <td><span class="text-uppercase text-center">${task.priority}</span></td>
          <td><span class="badge ${task.completed ? "bg-success" : "bg-danger"}"> ${task.completed ? "Yes" : "No"}</span></td>
          <td>
            <button class=" complete-task-button" onclick="taskManager.markAsCompleted(${index})">Complete</button>
            <button class=" change-priority-button" onclick="showChangePriorityModal(${index})">Change Priority</button>
            <button class="delete-task-button" onclick="taskManager.deleteTask(${index})">Delete</button>
          </td>
        `;
            taskTableBody.appendChild(row);
        });
    }

    async fetchTasks() {
        // Personal Tasks
        const personalTasksResponse = await (await fetch('http://backend.restapi.co.za/items/ptasks')).json();
        personalTasksResponse.data.forEach(task => {
            this.tasks.push(new PersonalTask(task.description, task.duedate,task.duration, task.priority, task.notes));
        })
        // Work Tasks
        const workTasksResponse = await (await fetch('http://backend.restapi.co.za/items/wtasks')).json();
        workTasksResponse.data.forEach(task => {
            this.tasks.push(new WorkTask(task.description, task.duedate, task.priority, task.project, task.assignee));
        })
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    startWatchdog() {
        setInterval(() => {
          const now = new Date();
          this.tasks.forEach((task, index) => {
            if (!task.completed) {
              const timeDifference = task.dueDate - now;
              if (timeDifference <= 3600000 && timeDifference > 0) {
                showToast(`Reminder: Task "${task.description}" is due in 1 hour!`, "warning");
              } else if (timeDifference < 0) {
                showToast(`Overdue: Task "${task.description}" was due!`, "danger");
              }
            }
          });
        }, 1000*60); // Check every minute
      }

}

// Initialize TaskManager after DOM is fully loaded
let taskManager;
$(document).ready(async function () {
    taskManager = new TaskManager();
    await taskManager.fetchTasks();
    taskManager.renderTasks();
    taskManager.startWatchdog();
    DigitalClock();


    // Add Task
    $('#category').on('change', function () {
        const selectedCategory = $(this).val();
        if (selectedCategory === "Personal") {
            $('#project').hide();
            $('#assignee').hide();
            $('#duration').show();
            $('#notes').show();
        } else if (selectedCategory === "Work") {
            $('#duration').hide();
            $('#notes').hide();
            $('#project').show();
            $('#assignee').show();
        }
    })
    $('#taskForm').on('submit', function (event) {
        event.preventDefault();
        const description = $('#description').val();
        const category = $('#category').val();
        const dueDate = $('#dueDate').val();
        const priority = $('#priority').val();
        if(category=="Personal"){
            if (!description || !dueDate || !priority) {
                showToast("Please fill in all fields!", "danger");
                return;
            }
            taskManager.addTask(new PersonalTask(description, dueDate, $('#duration').val(), priority, $('#notes').val()));
            $('#taskModal').modal('hide');
            return;
        }
        if(category=="Work"){
            if (!description || !dueDate || !priority) {
                showToast("Please fill in all fields!", "danger");
                return;
            }
            taskManager.addTask(new WorkTask(description, dueDate, priority, $('#project').val(), $('#assignee').val()));
            $('#taskModal').modal('hide');
            return;
        }

    })

    // Change Priority
    $('#changePriorityForm').on('submit', function (event) {
        event.preventDefault();
        const index = $('#index').val();
        const newPriority = $('#newPriority').val();
        taskManager.updateTaskPriority(index, newPriority);
        $('#changePriorityModal').modal('hide');
    })
});


// Show Change Priority Modal
function showChangePriorityModal(index) {
    const task = taskManager.tasks[index];
    const prioritySelect = document.getElementById("newPriority");
    prioritySelect.value = task.priority;
    $('#changePriorityModal').modal('show');
    $('#index').val(index);
}


// Initialize Clock
function DigitalClock() {
    const clockElement = document.getElementById("clock");
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleString();
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Show Toast Notification
function showToast(message, type) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.innerHTML =  `<div class="toast show  text-bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
    <strong class="me-auto">Task Manager</strong>
    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">${message}</div>
    </div>
    `;
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 3000);
}

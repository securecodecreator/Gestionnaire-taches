document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value;
        const taskPriority = prioritySelect.value;
        if (taskText.trim() !== '') {
            const taskId = 'task-' + Date.now();
            addTask(taskId, taskText, taskPriority);
            saveTask(taskId, taskText, taskPriority);
            taskInput.value = '';
        } else {
            alert('Veuillez entrer une tâche.');
        }
    });

    function addTask(id, text, priority) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item', `priority-${priority}`);
        taskItem.setAttribute('data-id', id);
        taskItem.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="delete-btn">&times;</button>
        `;
        taskList.appendChild(taskItem);

        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
            deleteTask(id);
        });
    }

    function saveTask(id, text, priority) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ id, text, priority });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => {
            const priorities = { 'urgent': 3, 'important': 2, 'normal': 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
        tasks.forEach(task => {
            addTask(task.id, task.text, task.priority);
        });
    }

    function deleteTask(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks();

    // Particles animation
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = '#4CAF50';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
});
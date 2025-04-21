const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const subscribeBtn = document.getElementById('subscribe-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    li.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
    showNotification('Добавлена новая задача!');
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    renderTasks();
  });
});

function showNotification(msg) {
  if (Notification.permission === 'granted') {
    new Notification(msg);
  }
}

subscribeBtn.addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    alert('Уведомления включены');
  } else {
    alert('Не удалось включить уведомления');
  }
});

// Уведомление через 2 часа (для теста можно сократить интервал)
setInterval(() => {
  const hasActiveTasks = tasks.some(t => !t.completed);
  if (hasActiveTasks) showNotification('Напоминание: у вас есть невыполненные задачи!');
}, 2 * 60 * 60 * 1000);

renderTasks();

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => console.log('Service Worker зарегистрирован'));
}

import { readTasks, writeTasks } from './storageService';

function persist(tasks) {
  writeTasks(tasks);
  return tasks;
}

export function getTasks() {
  return readTasks();
}

export function addTask(taskInput) {
  const current = readTasks();
  const next = [
    {
      id: crypto.randomUUID(),
      title: taskInput.title,
      completed: false,
      dueDate: taskInput.dueDate ?? null,
      priority: taskInput.priority ?? 'normal',
      category: taskInput.category ?? 'general',
      createdAt: new Date().toISOString(),
    },
    ...current,
  ];

  return persist(next);
}

export function toggleTask(id) {
  const next = readTasks().map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  return persist(next);
}

export function deleteTask(id) {
  return persist(readTasks().filter((task) => task.id !== id));
}

export function updateTask(id, patch) {
  const next = readTasks().map((task) =>
    task.id === id ? { ...task, ...patch } : task
  );

  return persist(next);
}

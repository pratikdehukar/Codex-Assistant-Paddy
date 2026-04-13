const TASKS_KEY = 'voice_todo_tasks_v1';

export function readTasks() {
  const serialized = localStorage.getItem(TASKS_KEY);
  if (!serialized) return [];

  try {
    return JSON.parse(serialized);
  } catch {
    return [];
  }
}

export function writeTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

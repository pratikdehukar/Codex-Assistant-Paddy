import { useMemo, useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import VoiceRecorder from './components/VoiceRecorder';
import {
  addTask,
  deleteTask,
  getTasks,
  toggleTask,
  updateTask,
} from './services/taskService';

export default function App() {
  const [tasks, setTasks] = useState(getTasks());
  const [filter, setFilter] = useState('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  const handleAddTask = (input) => {
    if (!input?.title?.trim()) {
      return;
    }
    setTasks(addTask(input));
  };

  const handleToggleTask = (id) => setTasks(toggleTask(id));
  const handleDeleteTask = (id) => setTasks(deleteTask(id));
  const handleUpdateTask = (id, data) => setTasks(updateTask(id, data));

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Smart Voice Todo</h1>
        <p>Speak or type tasks, and stay on top of your day.</p>
      </header>

      <section className="card">
        <TaskInput onAddTask={handleAddTask} />
        <VoiceRecorder onAddTask={handleAddTask} />
      </section>

      <section className="toolbar">
        {['all', 'pending', 'completed'].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={option === filter ? 'active' : ''}
          >
            {option}
          </button>
        ))}
      </section>

      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
    </main>
  );
}

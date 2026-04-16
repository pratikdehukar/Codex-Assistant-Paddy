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

  const pendingCount = tasks.filter((task) => !task.completed).length;

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
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <div className="bg-particles" aria-hidden="true" />

      <header className="app-header glass-panel">
        <div className="logo-mark" aria-hidden="true">◉</div>
        <div>
          <h1>Paddy AI Tasks</h1>
          <p>Neon productivity powered by voice.</p>
        </div>
        <span className="voice-status">● Voice-ready</span>
      </header>

      <section className="card glass-panel">
        <TaskInput onAddTask={handleAddTask} />
        <VoiceRecorder onAddTask={handleAddTask} />
      </section>

      <section className="toolbar glass-panel">
        <p>{pendingCount} pending tasks</p>
        <div>
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
        </div>
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

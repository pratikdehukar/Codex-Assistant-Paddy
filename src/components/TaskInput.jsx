import { useState } from 'react';
import { parseTaskInput } from '../services/nlpService';

export default function TaskInput({ onAddTask }) {
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    onAddTask(parseTaskInput(input));
    setInput('');
  };

  return (
    <form className="task-input" onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Type a task, e.g., Call John at 5 PM"
        aria-label="Manual task input"
      />
      <button type="submit" className="gradient-btn">Add Task</button>
    </form>
  );
}

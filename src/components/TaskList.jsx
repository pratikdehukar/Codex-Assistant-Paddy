import { format } from 'date-fns';
import { useState } from 'react';

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const beginEdit = (task) => {
    setEditingId(task.id);
    setDraft(task.title);
  };

  const saveEdit = (taskId) => {
    if (draft.trim()) {
      onUpdate(taskId, { title: draft.trim() });
    }
    setEditingId(null);
    setDraft('');
  };

  if (!tasks.length) {
    return <p className="empty-state">No tasks yet. Add one by typing or speaking.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item glass-panel ${task.completed ? 'completed' : ''}`}>
          <label className="task-state">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <span className="status-pill">{task.completed ? 'Completed' : 'Pending'}</span>
          </label>

          <div className="task-main">
            {editingId === task.id ? (
              <input
                className="edit-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(event) => event.key === 'Enter' && saveEdit(task.id)}
                autoFocus
              />
            ) : (
              <h3>{task.title}</h3>
            )}

            <p>
              {task.dueDate ? `Due: ${format(new Date(task.dueDate), 'PPp')}` : 'No due date'}
              {' • '}
              Priority: {task.priority}
              {' • '}
              Category: {task.category}
            </p>
          </div>

          <div className="task-actions">
            <button type="button" className="ghost-btn" onClick={() => beginEdit(task)}>Edit</button>
            <button type="button" className="ghost-btn danger" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

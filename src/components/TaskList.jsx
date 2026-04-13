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
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <span className="status">{task.completed ? 'Completed' : 'Pending'}</span>
          </label>

          <div className="task-main">
            {editingId === task.id ? (
              <input
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
            <button type="button" onClick={() => beginEdit(task)}>Edit</button>
            <button type="button" onClick={() => onDelete(task.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

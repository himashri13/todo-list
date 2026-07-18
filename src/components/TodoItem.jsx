import { useState, useRef, useEffect } from 'react';

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' };

function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatReminder(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  isDragging,
  isDragOver,
  isTouchDragging,
  index,
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleEditSubmit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditing(false);
    }
  }

  const itemClass = [
    'todo-item',
    todo.completed ? 'todo-item--completed' : '',
    isDragging ? 'todo-item--dragging' : '',
    isDragOver ? 'todo-item--drag-over' : '',
    isTouchDragging ? 'todo-item--touch-dragging' : '',
  ].filter(Boolean).join(' ');

  const dueLabel = formatDate(todo.dueDate);
  const reminderLabel = formatReminder(todo.reminder);

  return (
    <li
      className={itemClass}
      draggable
      data-todo-index={index}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <span
        className="todo-item__handle"
        aria-label="Drag to reorder"
        title="Drag to reorder"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <DragIcon />
      </span>

      <button
        id={`toggle-${todo.id}`}
        className={`todo-item__checkbox${todo.completed ? ' todo-item__checkbox--checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-checked={todo.completed}
        role="checkbox"
      >
        {todo.completed && <span className="todo-item__checkbox-icon">✓</span>}
      </button>

      <div className="todo-item__body">
        {editing ? (
          <input
            ref={inputRef}
            className="todo-item__edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            aria-label="Edit task"
          />
        ) : (
          <>
            <span
              className={`todo-item__text${todo.completed ? ' todo-item__text--done' : ''}`}
              onDoubleClick={() => !todo.completed && setEditing(true)}
              title="Double-click to edit"
            >
              {todo.text}
            </span>

            {(dueLabel || reminderLabel) && (
              <div className="todo-item__meta">
                {dueLabel && <span className="todo-item__meta-chip">📅 {dueLabel}</span>}
                {reminderLabel && <span className="todo-item__meta-chip">🔔 {reminderLabel}</span>}
              </div>
            )}
          </>
        )}
      </div>

      <span className={`priority-badge priority-badge--${todo.priority}`}>
        {PRIORITY_LABELS[todo.priority]}
      </span>

      <button
        id={`delete-${todo.id}`}
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
        title="Delete task"
      >
        <TrashIcon />
      </button>
    </li>
  );
}

function DragIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="2.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="2.5" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="7" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="7" r="1.2" fill="currentColor" />
      <circle cx="4.5" cy="11.5" r="1.2" fill="currentColor" />
      <circle cx="9.5" cy="11.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

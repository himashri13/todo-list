import { useState } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText('');
    setPriority('medium');
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit} aria-label="Add a new task">
      <input
        id="new-todo-input"
        className="add-todo__input"
        type="text"
        placeholder="Add a new task…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
      />

      <select
        id="priority-select"
        className="add-todo__select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Priority"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </option>
        ))}
      </select>

      <button
        id="add-todo-btn"
        type="submit"
        className="add-todo__btn"
        aria-label="Add task"
      >
        + Add
      </button>

      {/* Doll sits on the task bar with transparent background */}
      <img src="/cute_doll.png" alt="" className="doll" aria-hidden="true" />
    </form>
  );
}

import { useState } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate, reminder);
    setText('');
    setPriority('medium');
    setDueDate('');
    setReminder('');
  }

  return (
    <form className="add-todo" onSubmit={handleSubmit} aria-label="Add a new task">
      <div className="add-todo__main">
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
          {PRIORITIES.map((priorityOption) => (
            <option key={priorityOption} value={priorityOption}>
              {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
            </option>
          ))}
        </select>

        <button id="add-todo-btn" type="submit" className="add-todo__btn" aria-label="Add task">
          + Add
        </button>
      </div>

      <div className="add-todo__meta">
        <label className="add-todo__field">
          <span>Due date</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        <label className="add-todo__field">
          <span>Reminder</span>
          <input type="datetime-local" value={reminder} onChange={(e) => setReminder(e.target.value)} />
        </label>
      </div>

      <img src="/cute_doll.png" alt="" className="doll" aria-hidden="true" />
    </form>
  );
}

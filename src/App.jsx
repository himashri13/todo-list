import { useState, useEffect } from 'react';
import './App.css';

import Header     from './components/Header';
import AddTodo    from './components/AddTodo';
import FilterBar  from './components/FilterBar';
import TodoList   from './components/TodoList';

/* ─── Seed data shown on first load ─────────────────────── */
const SEED_TODOS = [
  { id: crypto.randomUUID(), text: 'Build an awesome todo app',    completed: false, priority: 'high'   },
  { id: crypto.randomUUID(), text: 'Add drag-and-drop reordering', completed: true,  priority: 'medium' },
  { id: crypto.randomUUID(), text: 'Write clean React components', completed: false, priority: 'low'    },
];

function loadTodos() {
  try {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : SEED_TODOS;
  } catch {
    return SEED_TODOS;
  }
}

export default function App() {
  const [todos,  setTodos]  = useState(loadTodos);
  const [filter, setFilter] = useState('all');

  /* Persist to localStorage whenever todos change */
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  /* ── CRUD handlers ──────────────────────────────────────── */
  function addTodo(text, priority) {
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, priority },
      ...prev,
    ]);
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  function editTodo(id, text) {
    setTodos((prev) =>
      prev.map((t) => t.id === id ? { ...t, text } : t)
    );
  }

  function reorderTodos(fromIndex, toIndex) {
    setTodos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }

  /* ── Derived state ──────────────────────────────────────── */
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active')    return !t.completed;
    if (filter === 'completed') return  t.completed;
    return true;
  });

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <Header total={todos.length} remaining={remaining} />
      <AddTodo onAdd={addTodo} />
      <FilterBar current={filter} onChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
        onReorder={reorderTodos}
      />
    </main>
  );
}

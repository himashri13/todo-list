import { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import AddTodo from './components/AddTodo';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';

/* ─── Seed data shown on first load ─────────────────────── */
const SEED_TODOS = [
  { id: crypto.randomUUID(), text: 'Build an awesome todo app', completed: false, priority: 'high', dueDate: '2026-07-20', reminder: '2026-07-19T09:00' },
  { id: crypto.randomUUID(), text: 'Add drag-and-drop reordering', completed: true, priority: 'medium', dueDate: '', reminder: '' },
  { id: crypto.randomUUID(), text: 'Write clean React components', completed: false, priority: 'low', dueDate: '', reminder: '' },
];

function normalizeTodo(todo) {
  return {
    ...todo,
    dueDate: todo.dueDate || '',
    reminder: todo.reminder || '',
  };
}

function loadTodos() {
  try {
    const stored = localStorage.getItem('todos');
    if (!stored) return SEED_TODOS;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeTodo) : SEED_TODOS;
  } catch {
    return SEED_TODOS;
  }
}

function loadTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState('all');
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  function addTodo(text, priority, dueDate, reminder) {
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, priority, dueDate, reminder },
      ...prev,
    ]);
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  }

  function editTodo(id, text) {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  }

  function reorderTodos(fromIndex, toIndex) {
    setTodos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <main className="app">
      <Header
        total={todos.length}
        remaining={remaining}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />
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

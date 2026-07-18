import { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import AddTodo from './components/AddTodo';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import CalendarView from './components/CalendarView';

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
    notified: todo.notified || false,
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const timersRef = new Map();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Request notification permission and schedule reminders for todos
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Clear existing timers
    timersRef.forEach((t) => clearTimeout(t));
    timersRef.clear();

    const now = Date.now();
    todos.forEach((todo) => {
      if (!todo.reminder || todo.notified) return;
      const when = new Date(todo.reminder).getTime();
      if (Number.isNaN(when)) return;
      const delay = when - now;
      if (delay <= 0) return; // past
      const id = setTimeout(() => {
        if (Notification.permission === 'granted') {
          try {
            new Notification('Todo reminder', {
              body: todo.text,
            });
          } catch (e) {
            // ignore
          }
        }
        // mark as notified so we don't repeat
        setTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, notified: true } : t));
      }, delay);
      timersRef.set(todo.id, id);
    });
    return () => {
      timersRef.forEach((t) => clearTimeout(t));
      timersRef.clear();
    };
  }, [todos]);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  function addTodo(text, priority, dueDate, reminder) {
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, priority, dueDate, reminder, notified: false },
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
        onToggleCalendar={() => setCalendarOpen((v) => !v)}
      />
      <AddTodo onAdd={addTodo} />
      <FilterBar current={filter} onChange={setFilter} />
      {calendarOpen && <CalendarView todos={todos} />}
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

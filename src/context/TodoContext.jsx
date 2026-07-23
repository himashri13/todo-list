import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SEED_TODOS = [
  {
    id: crypto.randomUUID(),
    text: 'Build an awesome React + Tailwind portfolio showcase',
    description: 'Transform task list into an industry standard productivity suite with dark mode, subtasks, and analytics.',
    status: 'todo',
    priority: 'high',
    category: 'work',
    dueDate: '2026-07-28',
    reminder: '',
    notified: false,
    subtasks: [
      { id: crypto.randomUUID(), text: 'Configure Vite & Tailwind CSS v4', completed: true },
      { id: crypto.randomUUID(), text: 'Add Lucide icons & glassmorphic UI', completed: true },
      { id: crypto.randomUUID(), text: 'Implement Kanban Board & Analytics view', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    text: 'Implement drag-and-drop & keyboard shortcuts',
    description: 'Support Ctrl+K command palette overlay and smooth card reordering.',
    status: 'completed',
    priority: 'medium',
    category: 'learning',
    dueDate: '2026-07-22',
    reminder: '',
    notified: false,
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    text: 'Weekly gym & health tracking',
    description: 'Focus on cardio and resistance training.',
    status: 'todo',
    priority: 'low',
    category: 'health',
    dueDate: '2026-07-26',
    reminder: '',
    notified: false,
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todoData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration from completed to status
          return parsed.map(todo => ({
            ...todo,
            status: todo.status || (todo.completed ? 'completed' : 'todo')
          }));
        }
      } catch (e) {
        console.error('Failed to parse todos', e);
      }
    }
    return SEED_TODOS;
  });

  useEffect(() => {
    localStorage.setItem('todoData', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = useCallback((todoData) => {
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        ...todoData,
        status: 'todo',
        createdAt: new Date().toISOString(),
        subtasks: todoData.subtasks || [],
      },
      ...prev,
    ]);
  }, []);

  const handleToggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        let nextStatus = 'todo';
        if (todo.status === 'todo') nextStatus = 'completed'; // Direct completion from list view
        else if (todo.status === 'in-progress') nextStatus = 'completed';
        else if (todo.status === 'completed') nextStatus = 'todo';
        
        return { ...todo, status: nextStatus };
      })
    );
  }, []);

  const handleUpdateTaskStatus = useCallback((id, status) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, status } : todo)));
  }, []);

  const handleDeleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const handleEditTodo = useCallback((id, updates) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id !== id) return todo;
        const newTodo = { ...todo, ...updates };
        if (typeof updates === 'string') {
          newTodo.text = updates;
        }

        // Automatic "in-progress" if subtasks are checked while status is "todo"
        if (updates.subtasks && newTodo.status === 'todo') {
          const hasCompletedSubtask = updates.subtasks.some(st => st.completed);
          if (hasCompletedSubtask) {
            newTodo.status = 'in-progress';
          }
        }
        
        return newTodo;
      })
    );
  }, []);

  const handleReorderTodos = useCallback((sourceIndex, destinationIndex) => {
    setTodos((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  }, []);

  const handleClearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => t.status !== 'completed'));
  }, []);

  const handleImportData = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.todos && Array.isArray(data.todos)) {
          const migrated = data.todos.map(todo => ({
            ...todo,
            status: todo.status || (todo.completed ? 'completed' : 'todo')
          }));
          setTodos(migrated);
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file structure.');
        }
      } catch (error) {
        alert('Failed to parse backup file: ' + error.message);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleExportData = useCallback((format = 'csv') => {
    if (todos.length === 0) {
      alert('No tasks to export.');
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      const headers = ['Task', 'Description', 'Category', 'Priority', 'Due Date', 'Status'];
      
      const escapeCsv = (str) => {
        if (!str) return '';
        const s = String(str).replace(/"/g, '""');
        return `"${s}"`;
      };

      const rows = todos.map(t => [
        escapeCsv(t.text),
        escapeCsv(t.description),
        escapeCsv(t.category),
        escapeCsv(t.priority),
        escapeCsv(t.dueDate),
        escapeCsv(t.status)
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskflow-export-${dateStr}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.text('TaskFlow Export', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${dateStr}`, 14, 30);

      const tableData = todos.map(t => [
        t.text,
        t.category,
        t.priority,
        t.dueDate,
        t.status
      ]);

      doc.autoTable({
        startY: 40,
        head: [['Task', 'Category', 'Priority', 'Due Date', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }, // emerald-500
        styles: { fontSize: 9, cellPadding: 3 },
      });

      doc.save(`taskflow-export-${dateStr}.pdf`);
    }
  }, [todos]);

  const handleResetSeedData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset to demo data? This will overwrite your current tasks.')) {
      setTodos(SEED_TODOS);
    }
  }, []);

  const contextValue = useMemo(() => ({
    todos,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleUpdateTaskStatus,
    handleReorderTodos,
    handleClearCompleted,
    handleImportData,
    handleExportData,
    handleResetSeedData
  }), [
    todos,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    handleUpdateTaskStatus,
    handleReorderTodos,
    handleClearCompleted,
    handleImportData,
    handleExportData,
    handleResetSeedData
  ]);

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}

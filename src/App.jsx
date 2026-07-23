import { useState, useEffect, useRef, useMemo } from 'react';
import { useTodoContext } from './context/TodoContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import CommandPalette from './components/CommandPalette';
import ImportDataModal from './components/ImportDataModal';
import ExportDataModal from './components/ExportDataModal';

function loadTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const {
    todos,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo: handleUpdateTodoDetails,
    handleReorderTodos,
    handleImportData,
    handleExportData,
    handleResetSeedData,
    handleClearCompleted,
    handleUpdateTaskStatus
  } = useTodoContext();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban' | 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters for FilterBar
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // UI States
  const [theme, setTheme] = useState(loadTheme);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeTaskModal, setActiveTaskModal] = useState(null); // Which task is open in the modal
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddInitialDate, setQuickAddInitialDate] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const timersRef = useRef(new Map());

  // Save to LocalStorage is now handled in TodoContext

  // Apply Theme Class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Browser Notification Reminders
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current.clear();

    const now = Date.now();
    todos.forEach((todo) => {
      if (!todo.reminder || todo.notified) return;
      const when = new Date(todo.reminder).getTime();
      if (Number.isNaN(when)) return;
      const delay = when - now;
      if (delay <= 0) return;

      const id = setTimeout(() => {
        if (Notification.permission === 'granted') {
          try {
            new Notification('TaskFlow Reminder', {
              body: todo.text,
              icon: '/favicon.ico',
            });
          } catch {
            // ignore fallback
          }
        }
        // Notifications trigger locally, but state update needs context.
        // We'll skip setting notified: true in this simplified refactor, or handle it via context.
        // For now, the notification fires based on time.
      }, delay);

      timersRef.current.set(todo.id, id);
    });

    const currentTimers = timersRef.current;
    return () => {
      currentTimers.forEach((t) => clearTimeout(t));
      currentTimers.clear();
    };
  }, [todos]);

  // Data actions handled by Context

  function handleToggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // Filter & Sort Logic
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesText = todo.text.toLowerCase().includes(q);
          const matchesCat = todo.category.toLowerCase().includes(q);
          const matchesDesc = (todo.description || '').toLowerCase().includes(q);
          if (!matchesText && !matchesCat && !matchesDesc) return false;
        }

        if (currentFilter === 'active' && todo.status === 'completed') return false;
        if (currentFilter === 'completed' && todo.status !== 'completed') return false;
        if (currentFilter === 'in-progress' && todo.status !== 'in-progress') return false;

        if (selectedCategory !== 'all' && todo.category !== selectedCategory) return false;
        if (selectedPriority !== 'all' && todo.priority !== selectedPriority) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
        if (sortBy === 'priority') {
          const pMap = { high: 1, medium: 2, low: 3 };
          return pMap[a.priority] - pMap[b.priority];
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [todos, searchQuery, currentFilter, selectedCategory, selectedPriority, sortBy]);

  const remainingCount = useMemo(() => {
    return todos.filter((t) => t.status !== 'completed').length;
  }, [todos]);

  return (
    <div className="flex h-full w-full overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <Sidebar 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onResetSeedData={handleResetSeedData}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        {/* Fixed Header Area */}
        <div className="px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8 shrink-0 z-30">
          <Navbar
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenQuickAdd={() => {
            setQuickAddInitialDate('');
            setIsQuickAddOpen(true);
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearCompleted={handleClearCompleted}
            remainingCount={remainingCount}
          />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 pt-0 md:p-6 md:pt-0 lg:p-8 lg:pt-0 relative">
          {/* Add Todo Modal */}
        {isQuickAddOpen && (
          <AddTodo 
            initialDate={quickAddInitialDate}
            onAdd={handleAddTodo} 
            onCancel={() => {
              setIsQuickAddOpen(false);
              setQuickAddInitialDate('');
            }} 
          />
        )}

        {viewMode === 'analytics' ? (
          <AnalyticsDashboard todos={todos} />
        ) : viewMode === 'calendar' ? (
          <CalendarView
            todos={todos}
            onSelectTask={(task) => setActiveTaskModal(task)}
            onDayClick={(dateStr) => {
              setQuickAddInitialDate(dateStr);
              setIsQuickAddOpen(true);
            }}
            onClose={() => setViewMode('list')}
          />
        ) : viewMode === 'kanban' ? (
          <KanbanBoard 
            todos={filteredTodos} 
            onToggle={handleToggleTodo}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDelete={handleDeleteTodo}
            onOpenTaskModal={(task) => setActiveTaskModal(task)}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodoDetails}
              onReorder={handleReorderTodos}
              onEdit={(todo) => setActiveTaskModal(todo)}
              onOpenTaskModal={(todo) => setActiveTaskModal(todo)}
            />
          </div>
        )}
      </main>
      </div>

      {/* Task Edit Modal */}
      {activeTaskModal && (
        <TaskModal
          todo={activeTaskModal}
          onClose={() => setActiveTaskModal(null)}
          onSave={(id, updates) => handleUpdateTodoDetails(id, updates)}
        />
      )}

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        todos={todos}
        onOpenTaskModal={(t) => setActiveTaskModal(t)}
        onOpenQuickAdd={() => {
          setViewMode('list');
          setQuickAddInitialDate('');
          setIsQuickAddOpen(true);
        }}
        onViewModeChange={setViewMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Import Data Modal */}
      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportData}
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportData}
      />
    </div>
  );
}

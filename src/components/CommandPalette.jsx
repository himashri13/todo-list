import { useEffect, useState } from 'react';
import { Search, Plus, ListTodo, Kanban, BarChart3, CalendarIcon, X, ArrowRight } from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  todos,
  onOpenTaskModal,
  onOpenQuickAdd,
  onViewModeChange,
}) {

  const [query, setQuery] = useState('');

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = query
    ? todos.filter(
        (t) =>
          t.text.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : todos.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3 text-xs">
          <div>
            <div className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] text-slate-400">
              Quick Actions
            </div>
            <div className="space-y-1 mt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuickAdd();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Create New Task</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewModeChange('list');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-sky-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Switch to List View</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewModeChange('kanban');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Kanban className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Switch to Kanban Board</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewModeChange('analytics');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Open Analytics Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onViewModeChange('calendar');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-rose-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">Open Calendar View</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            </div>
          </div>

          {/* Filtered Tasks Search Results */}
          <div>
            <div className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] text-slate-400">
              Matching Tasks ({filteredTasks.length})
            </div>
            <div className="space-y-1 mt-1">
              {filteredTasks.length === 0 ? (
                <div className="px-3 py-3 text-slate-400 text-center">No tasks match "{query}"</div>
              ) : (
                filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onClose();
                      onOpenTaskModal(t);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className={`font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.text}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {t.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flag, Edit3, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, getSubtaskProgress } from '../types/todo';

export default function KanbanBoard({
  todos,
  onToggle,
  onDelete,
  onOpenTaskModal,
  onUpdateTaskStatus,
}) {

  const [groupBy, setGroupBy] = useState('status'); // 'status' | 'priority'

  const statusColumns = [
    { id: 'todo', title: 'To Do', icon: Circle, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'in-progress', title: 'In Progress', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  const priorityColumns = [
    { id: 'high', title: 'High Priority', color: 'text-rose-600 bg-rose-500/10' },
    { id: 'medium', title: 'Medium Priority', color: 'text-amber-600 bg-amber-500/10' },
    { id: 'low', title: 'Low Priority', color: 'text-sky-600 bg-sky-500/10' },
  ];

  const activeColumns = groupBy === 'status' ? statusColumns : priorityColumns;

  function getTasksForColumn(colId) {
    if (groupBy === 'status') {
      return todos.filter((t) => t.status === colId);
    } else {
      return todos.filter((t) => t.priority === colId);
    }
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && groupBy === 'status') {
      onUpdateTaskStatus(taskId, colId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl shadow-inner border border-slate-300/50 dark:border-slate-700/50">
          <button
            onClick={() => setGroupBy('status')}
            className={`px-6 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all duration-300 ${
              groupBy === 'status'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            By Status
          </button>
          <button
            onClick={() => setGroupBy('priority')}
            className={`px-6 py-2 text-sm font-bold rounded-xl cursor-pointer transition-all duration-300 ${
              groupBy === 'priority'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            By Priority
          </button>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="flex flex-col md:flex-row gap-6 w-full md:overflow-x-auto md:pb-4 hide-scrollbar">
        {activeColumns.map((col) => {
          const colTasks = getTasksForColumn(col.id);
          return (
            <div
              key={col.id}
              className="w-full md:flex-1 md:min-w-[300px] md:shrink-0 p-4 sm:p-5 rounded-2xl border flex flex-col max-h-[85vh] backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-700/80 shadow-md"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className={`p-1.5 rounded-lg ${col.color}`}>
                    {col.icon ? <col.icon className="w-4 h-4" /> : <Flag className="w-4 h-4" />}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{col.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
                <AnimatePresence mode="popLayout">
                  {colTasks.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <p className="text-xs text-slate-400">No tasks in this column</p>
                    </motion.div>
                  ) : (
                    colTasks.map((todo, index) => {
                      const categoryObj = CATEGORIES.find((c) => c.id === todo.category) || CATEGORIES[5];
                      const { completed: subDone, total: subTotal } = getSubtaskProgress(todo.subtasks);

                      return (
                        <motion.div
                          key={todo.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: Math.min(index * 0.05, 0.3) }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, todo.id)}
                          className="p-4 rounded-xl border hover:border-indigo-500/40 transition-all shadow-sm group hover:shadow-md backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border-slate-200/80 dark:border-slate-700/80 cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2 w-full min-w-0">
                            <button
                              onClick={() => onToggle(todo.id)}
                              className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              {todo.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                              ) : todo.status === 'in-progress' ? (
                                <Clock className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                            <span
                              className={`flex-1 text-sm font-medium leading-snug cursor-pointer break-words min-w-0 ${
                                todo.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                              }`}
                              onClick={() => onOpenTaskModal(todo)}
                            >
                              {todo.text}
                            </span>
                          </div>

                          {todo.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 pl-7 break-words">
                              {todo.description}
                            </p>
                          )}

                          {/* Meta row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-500">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${categoryObj.color}`}>
                                {categoryObj.name}
                              </span>
                              {subTotal > 0 && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                                  {subDone}/{subTotal} subtasks
                                </span>
                              )}
                              {todo.dueDate && (
                                <span className="flex items-center gap-1 text-[10px]">
                                  <Clock className="w-3 h-3 text-indigo-500" />
                                  {todo.dueDate}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onOpenTaskModal(todo)}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDelete(todo.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

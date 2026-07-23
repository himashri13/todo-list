import { useState, useRef, useEffect } from 'react';
import {
  GripVertical,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Bell,
  Trash2,
  Edit3,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CATEGORIES, PRIORITIES, getSubtaskProgress } from '../types/todo';

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onOpenTaskModal,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging,
  isDragOver,
  index,
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleToggleClick(e) {
    e.stopPropagation();
    if (todo.status !== 'completed') {
      // Trigger subtle celebration burst
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b'],
      });
    }
    onToggle(todo.id);
  }

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

  const categoryObj = CATEGORIES.find((c) => c.id === todo.category) || CATEGORIES[5];
  const priorityObj = PRIORITIES.find((p) => p.id === todo.priority) || PRIORITIES[1];

  const { completed: subDone, total: subTotal } = getSubtaskProgress(todo.subtasks);

  // Overdue check
  const isOverdue =
    todo.dueDate &&
    todo.status !== 'completed' &&
    new Date(todo.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
      draggable
      data-todo-index={index}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group relative rounded-2xl border p-5 mb-3 transition-all duration-300 backdrop-blur-xl ${
        todo.status === 'completed'
          ? 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 shadow-sm' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-indigo-500/30'
      } ${isDragging ? 'opacity-40 scale-95 border-dashed border-indigo-500' : ''} ${
        isDragOver ? 'ring-2 ring-indigo-500/50 scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <span
          className="cursor-grab active:cursor-grabbing text-slate-400/50 group-hover:text-slate-400 dark:text-slate-600 hover:!text-slate-600 transition-colors p-1 -ml-2"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </span>

        {/* Completion checkbox */}
        <button
          onClick={handleToggleClick}
          className="flex-shrink-0 transition-colors mr-1"
          aria-label={todo.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.status === 'completed' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />
          ) : todo.status === 'in-progress' ? (
            <Clock className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-500 dark:text-slate-600" />
          )}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 text-sm rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-300/80 dark:border-slate-700/80 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-4">
                <span
                  onDoubleClick={() => todo.status !== 'completed' && setEditing(true)}
                  className={`block text-base font-semibold leading-snug cursor-pointer transition-all break-words ${
                    todo.status === 'completed'
                      ? 'line-through text-slate-500 dark:text-slate-400 font-medium'
                      : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  title="Double-click to inline edit or click edit icon for full options"
                >
                  {todo.text}
                </span>

                {/* Due Date on Top Right */}
                {todo.dueDate && (
                  <span
                    className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      isOverdue 
                        ? 'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/20' 
                        : 'text-slate-500 border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    {isOverdue ? <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> : <Calendar className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </span>
                )}
              </div>

              {todo.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 pr-8 break-words">
                  {todo.description}
                </p>
              )}

              {/* Badges & Meta Info Row */}
              <div className="flex items-center gap-2 flex-wrap pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                {/* Category Tag */}
                <span className={`px-2.5 py-1 rounded-lg border font-bold ${categoryObj.color}`}>
                  {categoryObj.name}
                </span>

                {/* Priority Badge */}
                <span className={`px-2.5 py-1 rounded-lg border font-bold ${priorityObj.color}`}>
                  {priorityObj.name}
                </span>

                {/* Subtask count */}
                {subTotal > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    <CheckSquare className="w-3 h-3 text-indigo-500" />
                    <span>
                      {subDone}/{subTotal}
                    </span>
                  </span>
                )}



                {/* Reminder */}
                {todo.reminder && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Bell className="w-3 h-3 text-amber-500" />
                    <span>{new Date(todo.reminder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={() => onOpenTaskModal(todo)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            title="Edit details & subtasks"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.li>
  );
}

import { useState } from 'react';
import { X, Calendar, Bell, Tag, Flag, CheckSquare, Plus, Trash2, AlignLeft, Clock, Circle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, PRIORITIES, getSubtaskProgress } from '../types/todo';

export default function TaskModal({ todo, onClose, onSave }) {
  const [text, setText] = useState(todo.text || '');
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [category, setCategory] = useState(todo.category || 'personal');
  const [status, setStatus] = useState(todo.status || 'todo');
  const [dueDate, setDueDate] = useState(todo.dueDate || '');
  const [reminder, setReminder] = useState(todo.reminder || '');
  const [subtasks, setSubtasks] = useState(todo.subtasks || []);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  function handleAddSubtask(e) {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: crypto.randomUUID(), text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText('');
  }

  function handleToggleSubtask(id) {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  }

  function handleDeleteSubtask(id) {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  }

  function handleSave() {
    if (!text.trim()) return;
    onSave(todo.id, {
      text: text.trim(),
      description: description.trim(),
      priority,
      category,
      status,
      dueDate,
      reminder,
      subtasks,
    });
    onClose();
  }

  const { completed, total, percentage } = getSubtaskProgress(subtasks);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-xl bg-white/95 dark:bg-slate-900/95"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Task Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-slate-800 dark:text-slate-200">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Notes & Details</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50"
              placeholder="Add more details, links, or notes..."
            />
          </div>

          {/* Status, Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" />
                <span>Reminder Alert</span>
              </label>
              <input
                type="datetime-local"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Subtasks ({completed}/{total})
              </label>
              {total > 0 && (
                <span className="text-xs font-medium text-indigo-500">{percentage}% done</span>
              )}
            </div>

            {total > 0 && (
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}

            <div className="space-y-2 mb-3">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100/60 dark:bg-slate-800/60"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => handleToggleSubtask(st.id)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span
                    className={`flex-1 text-xs ${
                      st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {st.text}
                  </span>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add a step..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg glass-input text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

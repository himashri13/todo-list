export const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-100 border-blue-200 dark:border-blue-700' },
  { id: 'personal', name: 'Personal', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-100 border-purple-200 dark:border-purple-700' },
  { id: 'health', name: 'Health & Fitness', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-100 border-emerald-200 dark:border-emerald-700' },
  { id: 'finance', name: 'Finance', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-100 border-amber-200 dark:border-amber-700' },
  { id: 'learning', name: 'Learning', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-100 border-indigo-200 dark:border-indigo-700' },
  { id: 'other', name: 'General', color: 'bg-slate-200 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 border-slate-300 dark:border-slate-600' },
];

export const PRIORITIES = [
  { id: 'high', name: 'High Priority', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-100 border-rose-200 dark:border-rose-700', badgeBg: 'bg-rose-600 text-white' },
  { id: 'medium', name: 'Medium Priority', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-100 border-amber-200 dark:border-amber-700', badgeBg: 'bg-amber-500 text-slate-900' },
  { id: 'low', name: 'Low Priority', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-100 border-sky-200 dark:border-sky-700', badgeBg: 'bg-slate-500 text-white' },
];

export function createTodo({
  text,
  priority = 'medium',
  category = 'personal',
  dueDate = '',
  reminder = '',
  description = '',
  subtasks = [],
}) {
  return {
    id: crypto.randomUUID(),
    text,
    description,
    completed: false,
    priority,
    category,
    dueDate,
    reminder,
    notified: false,
    subtasks,
    createdAt: new Date().toISOString(),
  };
}

export function getSubtaskProgress(subtasks = []) {
  if (!subtasks || subtasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
  const completed = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

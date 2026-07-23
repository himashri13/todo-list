import { Calendar } from 'lucide-react';

export default function Header({ total, remaining }) {
  const completed = total - remaining;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Focus & Accomplishments
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-indigo-500/10 dark:bg-indigo-500/20 px-4 py-2.5 rounded-2xl border border-indigo-500/20">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {percentage}%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completed} of {total} Tasks Completed
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {remaining === 0 && total > 0 ? '🎉 All tasks done!' : `${remaining} active items remaining`}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      {total > 0 && (
        <div className="mt-4 w-full bg-slate-200/80 dark:bg-slate-700/80 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-violet-500 h-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

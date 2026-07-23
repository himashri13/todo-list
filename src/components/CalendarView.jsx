import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../types/todo';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ todos, onSelectTask, onDayClick, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute the 7x6 calendar grid for the current month
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];
    let dayCounter = 1;
    let nextMonthCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          // Previous month days
          const prevDate = daysInPrevMonth - firstDayOfMonth + j + 1;
          week.push({ date: new Date(year, month - 1, prevDate), isCurrentMonth: false });
        } else if (dayCounter > daysInMonth) {
          // Next month days
          week.push({ date: new Date(year, month + 1, nextMonthCounter++), isCurrentMonth: false });
        } else {
          // Current month days
          week.push({ date: new Date(year, month, dayCounter++), isCurrentMonth: true });
        }
      }
      grid.push(week);
    }
    return grid;
  }, [year, month]);

  // Map tasks by YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    return todos.reduce((acc, t) => {
      if (!t.dueDate) return acc;
      acc[t.dueDate] = acc[t.dueDate] || [];
      acc[t.dueDate].push(t);
      return acc;
    }, {});
  }, [todos]);

  function handlePrevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full h-full flex flex-col space-y-4 animate-in fade-in duration-300">
      
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between p-4 rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{monthLabel}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div className="flex-1 flex flex-col p-4 sm:p-4 rounded-3xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-700/80 shadow-md overflow-hidden min-h-0">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 mb-4">
          {DAYS_OF_WEEK.map((dayName) => (
            <div
              key={dayName}
              className="text-center pb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700/80"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* 7x6 Grid Layout */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-200 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden">
          {calendarGrid.flat().map((dateObj, idx) => {
            // Reconstruct a timezone-safe YYYY-MM-DD string
            const localDateStr = new Date(dateObj.date.getTime() - (dateObj.date.getTimezoneOffset() * 60000))
              .toISOString()
              .split('T')[0];

            const isToday = localDateStr === todayStr;
            const dayTasks = tasksByDate[localDateStr] || [];
            
            return (
              <div
                key={idx}
                onClick={() => onDayClick && onDayClick(localDateStr)}
                className={`bg-white dark:bg-slate-900 p-2 overflow-y-auto flex flex-col group transition-colors cursor-pointer ${
                  !dateObj.isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-800/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : !dateObj.isCurrentMonth
                        ? 'text-slate-300 dark:text-slate-600'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dateObj.date.getDate()}
                  </span>
                </div>

                {/* Event Pills */}
                <div className="space-y-1.5 hide-scrollbar">
                  {dayTasks.map((task) => {
                    // Extract category color
                    const catInfo = CATEGORIES.find(c => c.id === task.category) || CATEGORIES.find(c => c.id === 'other');
                    
                    return (
                      <button
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask(task);
                        }}
                        className={`w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border shadow-sm truncate ${
                          task.completed 
                            ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 line-through' 
                            : `${catInfo.color.split(' ')[0]} ${catInfo.color.split(' ')[1]} ${catInfo.color.split(' ')[2]} ${catInfo.color.split(' ')[3]} border-transparent`
                        }`}
                        title={task.text}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-3 h-3 shrink-0 opacity-60" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-80" />
                        )}
                        <span className="truncate">{task.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

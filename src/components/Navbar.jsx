import { Search, Plus, Command, SlidersHorizontal, ArrowUpDown, Filter, Tag, Menu } from 'lucide-react';
import { CATEGORIES } from '../types/todo';

export default function Navbar({
  onOpenSidebar,
  searchQuery,
  onSearchChange,
  onOpenQuickAdd,
  onOpenCommandPalette,
  
  // Filter Props
  currentFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
}) {
  return (
    <header className="sticky top-0 z-30 w-full mb-6">
      <div className="p-4 rounded-2xl shadow-sm transition-all duration-200 backdrop-blur-lg border border-slate-200/50 bg-white/85 dark:bg-slate-900/85 dark:border-slate-700/50 px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 md:ml-0">
        
        {/* Left Section: Mobile Menu & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto md:max-w-xs lg:max-w-sm flex-1">
          {/* Mobile Menu Icon */}
          <button
            aria-label="Open Mobile Menu"
            className="md:hidden p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={onOpenSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              aria-label="Search tasks"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium transition-all pl-9 pr-12 !py-2 shadow-sm"
            />
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              title="Press Ctrl+K or Cmd+K"
            >
              <Command className="w-3 h-3" />
              <span>K</span>
            </button>
          </div>
          
          {/* Mobile Quick Add Icon */}
          <button 
            onClick={onOpenQuickAdd}
            className="md:hidden p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Right Section: Filters & Add Button */}
        <div className="grid grid-cols-2 md:flex md:items-center justify-start md:justify-end gap-2 pb-1 md:pb-0 w-full md:w-auto md:flex-nowrap">
          
          {/* Status Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-500 pointer-events-none" />
            <select
              aria-label="Filter by Status"
              value={currentFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full sm:w-auto min-w-[110px] bg-slate-200/50 dark:bg-slate-900/50 pl-8 pr-2 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="all">All Status</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="active">To Do</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="in-progress">In Progress</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="completed">Completed</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500 pointer-events-none" />
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto min-w-[110px] bg-slate-200/50 dark:bg-slate-900/50 pl-8 pr-2 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="all">All Tags</option>
              {CATEGORIES.map(c => (
                <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500 pointer-events-none" />
            <select
              aria-label="Filter by Priority"
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="w-full sm:w-auto min-w-[110px] bg-slate-200/50 dark:bg-slate-900/50 pl-8 pr-2 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="all">All Priorities</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="high">High</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="medium">Medium</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="low">Low</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-rose-500 pointer-events-none" />
            <select
              aria-label="Sort Tasks"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto min-w-[120px] bg-slate-200/50 dark:bg-slate-900/50 pl-8 pr-2 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-700/50 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
            >
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="createdAt">Newest First</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="dueDate">Due Date</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="priority">Priority</option>
              <option className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100" value="alphabetical">A-Z</option>
            </select>
          </div>

          <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1 hidden lg:block shrink-0"></div>

          {/* Desktop Quick Add Button */}
          <button onClick={onOpenQuickAdd} className="btn-primary flex-shrink-0 px-4 py-2 rounded-full hidden md:flex cursor-pointer">
            <Plus className="w-4 h-4" />
            <span className="font-bold">New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}

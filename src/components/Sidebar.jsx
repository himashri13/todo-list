import { 
  CheckSquare, 
  ListTodo, 
  Kanban, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  RefreshCw, 
  X, 
  Menu,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({
  viewMode,
  onViewModeChange,
  theme,
  onToggleTheme,
  onOpenExportModal,
  onOpenImportModal,
  onResetSeedData,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) {
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);

  function handleOpenImport() {
    onOpenImportModal();
  }

  const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={() => {
        onClick();
        setMobileOpen(false);
      }}
      aria-label={label}
      title={isCollapsed ? label : ''} // Browser tooltip for icon-only mode
      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-2xl text-sm font-semibold transition-all ${
        isActive
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  );

  return (
    <>
      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-md ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                  TaskFlow
                </h1>
                <p className="text-xs text-slate-500 font-medium truncate">Pro Suite</p>
              </div>
            )}
          </div>
          <button
            aria-label="Close Mobile Menu"
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shrink-0"
            onClick={onCloseMobile}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'px-3' : 'px-4'} py-4 space-y-2 overflow-y-auto overflow-x-hidden`}>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Views</p>
          )}
          <NavItem icon={ListTodo} label="Master List" isActive={viewMode === 'list'} onClick={() => { onViewModeChange('list'); onCloseMobile(); }} />
          <NavItem icon={Kanban} label="Boards" isActive={viewMode === 'kanban'} onClick={() => { onViewModeChange('kanban'); onCloseMobile(); }} />
          <NavItem icon={BarChart3} label="Analytics" isActive={viewMode === 'analytics'} onClick={() => { onViewModeChange('analytics'); onCloseMobile(); }} />
          <NavItem icon={CalendarIcon} label="Calendar" isActive={viewMode === 'calendar'} onClick={() => { onViewModeChange('calendar'); onCloseMobile(); }} />
        </nav>

        {/* Settings Footer */}
        <div className={`p-4 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1 overflow-hidden`}>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Settings</p>
          )}
          
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : ''}
            className={`w-full flex items-center cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-slate-700 shrink-0" />}
            {!isCollapsed && <span className="truncate">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button
            onClick={onOpenExportModal}
            aria-label="Export Data"
            title={isCollapsed ? 'Export Data' : ''}
            className={`w-full flex items-center cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors`}
          >
            <Download className="w-4 h-4 text-emerald-500 shrink-0" />
            {!isCollapsed && <span className="truncate">Export Data</span>}
          </button>

          <button 
            onClick={handleOpenImport}
            aria-label="Import Data"
            title={isCollapsed ? 'Import Data' : ''}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer`}
          >
            <Upload className="w-4 h-4 text-indigo-500 shrink-0" />
            {!isCollapsed && <span className="truncate">Import Data</span>}
          </button>

          <button
            onClick={() => setIsClearDataModalOpen(true)}
            aria-label="Clear Data"
            title={isCollapsed ? 'Clear Data' : ''}
            className={`w-full flex items-center cursor-pointer ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mt-2`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            {!isCollapsed && <span className="truncate">Clear Data</span>}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Designed and developed with ❤️<br/>
                <a 
                  href="https://www.himasri.pro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold underline hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors text-slate-500 dark:text-slate-400"
                >
                  Hima Sri
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="hidden md:flex absolute -right-3 top-20 z-50 items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shadow-md hover:scale-110 hover:text-emerald-500 transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Clear Data Confirmation Modal */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsClearDataModalOpen(false)} 
          />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Clear All Data?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This action will permanently delete all your tasks, subtasks, and categories. This cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsClearDataModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetSeedData();
                  setIsClearDataModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-colors"
              >
                Yes, Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

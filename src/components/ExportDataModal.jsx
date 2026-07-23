import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExportDataModal({ isOpen, onClose, onExport }) {
  const [selectedFormat, setSelectedFormat] = useState('csv'); // 'csv' or 'pdf'



  const handleExport = () => {
    onExport(selectedFormat);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={onClose} 
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
          >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export Tasks</h2>
              <p className="text-sm text-slate-500">Choose a format for your data report.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl cursor-pointer text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* CSV Option */}
            <button
              onClick={() => setSelectedFormat('csv')}
              className={`relative flex flex-col cursor-pointer items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                selectedFormat === 'csv'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {selectedFormat === 'csv' && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              )}
              <div className={`p-3 rounded-full ${selectedFormat === 'csv' ? 'bg-emerald-100 dark:bg-emerald-800/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <FileSpreadsheet className={`w-8 h-8 ${selectedFormat === 'csv' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
              <div className="text-center">
                <span className="block font-bold text-slate-900 dark:text-white">CSV</span>
                <span className="text-xs text-slate-500">Spreadsheet format</span>
              </div>
            </button>

            {/* PDF Option */}
            <button
              onClick={() => setSelectedFormat('pdf')}
              className={`relative flex flex-col cursor-pointer items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                selectedFormat === 'pdf'
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {selectedFormat === 'pdf' && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-500" />
                </div>
              )}
              <div className={`p-3 rounded-full ${selectedFormat === 'pdf' ? 'bg-rose-100 dark:bg-rose-800/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <FileText className={`w-8 h-8 ${selectedFormat === 'pdf' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
              <div className="text-center">
                <span className="block font-bold text-slate-900 dark:text-white">PDF</span>
                <span className="text-xs text-slate-500">Document format</span>
              </div>
            </button>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3.5 rounded-xl cursor-pointer font-bold text-white shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download {selectedFormat.toUpperCase()}
          </button>
        </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

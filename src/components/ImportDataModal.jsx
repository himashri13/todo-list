import { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportDataModal({ isOpen, onClose, onImport }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file) => {
    setError('');
    if (!file) return;
    
    // We expect a .csv or .json file
    const isCsv = file.name.endsWith('.csv');
    const isJson = file.name.endsWith('.json');
    
    if (!isCsv && !isJson) {
      setError('Please upload a valid .csv or .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        if (isJson) {
          const data = JSON.parse(text);
          onImport(data.todos || data); // handle standard or export format
          onClose();
        } else {
          // Basic CSV Parser
          const lines = text.split('\n').filter(line => line.trim().length > 0);
          if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row.');
          
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const textIdx = headers.indexOf('text');
          if (textIdx === -1) throw new Error('CSV must contain a "text" column.');

          const todos = lines.slice(1).map(line => {
            const values = line.split(',');
            const getVal = (colName) => {
              const idx = headers.indexOf(colName.toLowerCase());
              return idx !== -1 ? values[idx]?.trim() : '';
            };

            return {
              id: crypto.randomUUID(),
              text: getVal('text'),
              description: getVal('description') || '',
              category: getVal('category') || 'general',
              priority: getVal('priority') || 'medium',
              completed: getVal('completed')?.toLowerCase() === 'true',
              dueDate: getVal('dueDate') || '',
              createdAt: new Date().toISOString(),
              subtasks: []
            };
          }).filter(t => t.text);

          onImport(todos);
          onClose();
        }
      } catch (err) {
        setError(err.message || 'Failed to parse the file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    processFile(file);
    e.target.value = null; // reset
  };

  const downloadTemplate = () => {
    const csvContent = "text,description,category,priority,dueDate,completed\n\"Redesign landing page\",\"Update colors to match new branding\",work,high,2026-12-31,false";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "TaskFlow_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Tasks</h2>
              <p className="text-sm text-slate-500">Upload a CSV or JSON file to bulk add tasks.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Guidelines */}
          <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Formatting Guidelines
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              To ensure a seamless import, your CSV file (exported from Excel/Numbers) should contain the following column headers in the first row. Only <strong>text</strong> is required.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">text *</span>
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300">description</span>
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300">category</span>
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300">priority</span>
              <span className="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300">dueDate</span>
            </div>
            <button 
              onClick={downloadTemplate}
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV Template
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer w-full p-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/30 dark:hover:bg-slate-800/80'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4">
              <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Click or drag file to upload
            </h3>
            <p className="text-sm text-slate-500">
              Supports .csv and .json files up to 5MB
            </p>
            <input 
              type="file" 
              accept=".csv,.json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

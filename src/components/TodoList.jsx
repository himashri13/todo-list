import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import TodoItem from './TodoItem';

export default function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onOpenTaskModal,
  onReorder,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function handleDragStart(e, index) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }

  function handleDragEnter(index) {
    if (index !== draggedIndex) {
      setDragOverIndex(index);
    }
  }

  function handleDragEnd() {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  if (todos.length === 0) {
    return (
      <div className="p-12 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 text-center space-y-3 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-md">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No tasks found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No tasks match your current filter or search criteria. Try clearing filters or adding a new task!
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence mode="popLayout">
        {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onOpenTaskModal={onOpenTaskModal}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index}
            />
        ))}
      </AnimatePresence>
    </ul>
  );
}

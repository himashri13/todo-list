import { useRef, useState } from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit, onReorder }) {
  const dragIndex = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  function handleDragStart(index, id) {
    dragIndex.current = index;
    setDraggingId(id);
  }

  function handleDragEnter(index) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    onReorder(dragIndex.current, index);
    dragIndex.current = index;
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
    dragIndex.current = null;
  }

  if (todos.length === 0) {
    return (
      <div className="todo-list__empty" role="status">
        <div className="todo-list__empty-icon">✦</div>
        <p className="todo-list__empty-text">No tasks here</p>
        <p className="todo-list__empty-sub">Add one above to get started</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" aria-label="Task list">
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isDragging={draggingId === todo.id}
          isDragOver={dragOverId === todo.id}
          onDragStart={() => handleDragStart(index, todo.id)}
          onDragEnter={() => { setDragOverId(todo.id); handleDragEnter(index); }}
          onDragEnd={handleDragEnd}
        />
      ))}
    </ul>
  );
}

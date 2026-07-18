import { useRef, useState } from 'react';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit, onReorder }) {
  const dragIndex = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [touchDraggingId, setTouchDraggingId] = useState(null);
  const touchIndexRef = useRef(null);

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

  function handleTouchStart(index, id, e) {
    e.preventDefault();
    touchIndexRef.current = index;
    setTouchDraggingId(id);
  }

  function handleTouchMove(index, e) {
    if (touchIndexRef.current === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = element?.closest('[data-todo-index]');
    if (!targetItem) return;

    const targetIndex = Number(targetItem.dataset.todoIndex);
    if (!Number.isNaN(targetIndex) && targetIndex !== touchIndexRef.current && targetIndex >= 0 && targetIndex < todos.length) {
      onReorder(touchIndexRef.current, targetIndex);
      touchIndexRef.current = targetIndex;
    }
  }

  function handleTouchEnd() {
    setTouchDraggingId(null);
    touchIndexRef.current = null;
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
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isDragging={draggingId === todo.id}
          isDragOver={dragOverId === todo.id}
          isTouchDragging={touchDraggingId === todo.id}
          onDragStart={() => handleDragStart(index, todo.id)}
          onDragEnter={() => {
            setDragOverId(todo.id);
            handleDragEnter(index);
          }}
          onDragEnd={handleDragEnd}
          onTouchStart={(e) => handleTouchStart(index, todo.id, e)}
          onTouchMove={(e) => handleTouchMove(index, e)}
          onTouchEnd={handleTouchEnd}
        />
      ))}
    </ul>
  );
}

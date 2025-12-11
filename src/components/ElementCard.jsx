import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function ElementCard({ element, id, isOverlay = false }) {
  // id is unique instance ID for board items, or element ID for sidebar items
  // But for dnd-kit, we need a unique ID.
  // Sidebar items: "sidebar-fire"
  // Board items: "board-instance-123"
  
  // We'll pass the full ID to useDraggable.
  
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { element, source: id.startsWith('sidebar') ? 'sidebar' : 'board' },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : 'auto',
    // If it's an overlay (drag preview), we don't use transform from dnd-kit hooks logic relative to parent, 
    // but the DragOverlay handles positioning.
  };
  
  if (isOverlay) {
    return (
      <div className="element-card" style={{ cursor: 'grabbing', transform: 'scale(1.1)', zIndex: 999 }}>
        <div className="element-icon">{element.icon}</div>
        <div className="element-name">{element.name}</div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="element-card">
      <div className="element-icon">{element.icon}</div>
      <div className="element-name">{element.name}</div>
    </div>
  );
}

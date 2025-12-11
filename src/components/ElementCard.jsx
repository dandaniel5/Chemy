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

  // Determine drag style based on source
  const isSidebar = id.startsWith('sidebar');
  
  const style = {
    // If dragging from sidebar: keep original in place (no transform), fully visible
    // If dragging from board: hide original (opacity 0), no transform (Overlay handles visual)
    // We typically don't apply transform to the source if using Overlay for movement.
    // However, dnd-kit useDraggable usually tracks position via transform.
    // If we want the element to "follow" the mouse without Overlay, we use transform.
    // But since we use DragOverlay, we disable transform on the source element.
    transform: isSidebar ? undefined : (isDragging ? undefined : CSS.Translate.toString(transform)),
    
    // Actually, for board items, if we don't apply transform, it stays at original x,y.
    // If we apply transform, it moves.
    // We want it to "disappear" from original spot and "appear" as Overlay.
    opacity: isDragging ? (isSidebar ? 0.7 : 0) : 1, // Dim sidebar item slightly to show it's being used?
    
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 999 : 'auto',
    // Touch action is important for touch devices
    touchAction: 'none',
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

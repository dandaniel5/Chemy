import React, { useState, useRef } from 'react';
import { DndContext, useDroppable, DragOverlay, pointerWithin } from '@dnd-kit/core';
import { ElementCard } from './ElementCard';

export default function Game({ elements, recipes, discovered, onDiscover }) {
  const [instances, setInstances] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  
  const boardRef = useRef(null);

  const { setNodeRef } = useDroppable({
    id: 'game-board',
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setActiveElement(event.active.data.current.element);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveElement(null);

    if (!over) return;

    // Helper to get drop location relative to board
    // We can use event.active.rect.current.translated (the final position of the drag overlay)
    const activeRect = active.rect.current.translated;
    const boardRect = boardRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;
    if (activeRect && boardRect) {
      x = activeRect.left - boardRect.left;
      y = activeRect.top - boardRect.top;
    }

    // Source: Sidebar -> Board
    if (active.data.current.source === 'sidebar') {
      if (over.id === 'game-board') {
         const newInst = {
            instanceId: `inst-${Date.now()}`,
            elementId: active.data.current.element.id,
            x, y
         };
         setInstances([...instances, newInst]);
      } else if (over.data.current?.source === 'board') {
         // Dropped sidebar item onto existing instance
         attemptMix(active.data.current.element.id, over.data.current.element.id, over.id, x, y);
      }
    }
    
    // Source: Board -> Board (Move)
    if (active.data.current.source === 'board') {
      if (over.id === 'game-board') {
         // Update position
         setInstances(prev => prev.map(inst => {
            if (inst.instanceId === active.id) {
               return { ...inst, x, y };
            }
            return inst;
         }));
      } else if (over.data.current?.source === 'board' && over.id !== active.id) {
         // Mix Board Instance A + Board Instance B
         // Remove A (active) and B (over)
         attemptMix(active.data.current.element.id, over.data.current.element.id, over.id, x, y, active.id);
      }
    }
  };

  const attemptMix = (elemId1, elemId2, targetInstanceId, x, y, sourceInstanceId = null) => {
    // Find recipe
    // Inputs are arrays in any order
    const recipe = recipes.find(r => 
      (r.inputs.includes(elemId1) && r.inputs.includes(elemId2) && r.inputs.length === 2 && elemId1 !== elemId2) ||
      (elemId1 === elemId2 && r.inputs.filter(i => i === elemId1).length === 2) // self mix?
      // Simplified: Check if sorted inputs match sorted recipe inputs
    );
    
    // Better recipe check
    const match = recipes.find(r => {
        const sortedInputs = [...r.inputs].sort();
        const sortedAttempt = [elemId1, elemId2].sort();
        return JSON.stringify(sortedInputs) === JSON.stringify(sortedAttempt);
    });

    if (match) {
        // Success!
        // Remove source and target instances
        setInstances(prev => prev.filter(i => i.instanceId !== targetInstanceId && i.instanceId !== sourceInstanceId));
        
        // Add output instance
        const outputEl = elements.find(e => e.id === match.output);
        if (outputEl) {
             if (!discovered.includes(outputEl.id)) {
                 onDiscover(outputEl.id);
                 // Maybe show a notification
             }
             const newInst = {
                instanceId: `inst-${Date.now()}`,
                elementId: outputEl.id,
                x, y // Place at drop location
             };
             setInstances(prev => [...prev.filter(i => i.instanceId !== targetInstanceId && i.instanceId !== sourceInstanceId), newInst]);
        }
    } else {
        // No match (Mix Failed) -> Fallback to "Place/Move"
        
        // If source is Sidebar, create new instance at drop location (maybe offset slightly)
        if (!sourceInstanceId) {
             const newInst = {
                instanceId: `inst-${Date.now()}`,
                elementId: elemId1, // The dragged element
                x: x + 20, 
                y: y + 20
             };
             // We need to add to instances. Note: We didn't remove anything yet because it was sidebar source.
             setInstances(prev => [...prev, newInst]);
        }
        
        // If source is Board, move it to drop location
        if (sourceInstanceId) {
             setInstances(prev => prev.map(inst => {
                if (inst.instanceId === sourceInstanceId) {
                   return { ...inst, x: x + 20, y: y + 20 }; // Offset slightly to see both
                }
                return inst;
             }));
        }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
       {/* Sidebar is outside? Or passed in children? 
           The Sidebar needs to be inside DndContext.
           So Game component should probably wrap everything including sidebar.
       */}
       <div style={{display: 'flex', width: '100%', height: '100%'}}>
          {/* We'll accept Sidebar functionality outside or render it here? 
              Let's accept children or render sidebar here. 
              The prompt implies splitting components. But DndContext needs to wrap both.
              I'll render Sidebar here. 
           */}
           
           {/* Sidebar Area */}
           <div className="sidebar">
              <h3>Elements</h3>
              <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
                 {elements.filter(e => discovered.includes(e.id)).map(el => (
                    <ElementCard key={el.id} element={el} id={`sidebar-${el.id}`} />
                 ))}
              </div>
           </div>

           {/* Game Board Area */}
           <div className="game-board" ref={(node) => { setNodeRef(node); boardRef.current = node; }}>
              {instances.map(inst => {
                 const el = elements.find(e => e.id === inst.elementId);
                 if (!el) return null;
                 return (
                    <div key={inst.instanceId} style={{position: 'absolute', left: inst.x, top: inst.y}}>
                       <ElementCard element={el} id={inst.instanceId} />
                    </div>
                 );
              })}
           </div>
       </div>

       <DragOverlay>
           {activeElement ? <ElementCard element={activeElement} id="overlay" isOverlay /> : null}
       </DragOverlay>
    </DndContext>
  );
}

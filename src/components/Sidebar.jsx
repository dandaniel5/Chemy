import React from 'react';
import { ElementCard } from './ElementCard';

export default function Sidebar({ elements }) {
  return (
    <div className="sidebar">
      {elements.map(el => (
        <React.Fragment key={el.id}>
             {/* We use a wrapper or just the card. Sidebar elements need unique DnD IDs */}
            <ElementCard element={el} id={`sidebar-${el.id}`} />
        </React.Fragment>
      ))}
    </div>
  );
}

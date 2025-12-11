import React, { useState } from 'react';
import Game from './components/Game';
import Editor from './components/Editor';
import { defaultElements, defaultRecipes } from './data/initialData';

function App() {
  const [mode, setMode] = useState('play'); // 'play' | 'edit'
  const [elements, setElements] = useState(defaultElements);
  const [recipes, setRecipes] = useState(defaultRecipes);
  const [discovered, setDiscovered] = useState(['fire', 'water', 'earth', 'air', 'energy']); // Starters

  const handleDiscover = (id) => {
    if (!discovered.includes(id)) {
      setDiscovered([...discovered, id]);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 style={{margin:0, display:'flex', alignItems:'center', gap:'10px'}}>
          <span>⚗️</span> Chemy
        </h1>
        <div style={{display:'flex', gap:'10px'}}>
          <button 
             onClick={() => setMode('play')} 
             style={{backgroundColor: mode === 'play' ? '#646cff' : '#1a1a1a'}}
          >
            Play
          </button>
          <button 
             onClick={() => setMode('edit')}
             style={{backgroundColor: mode === 'edit' ? '#646cff' : '#1a1a1a'}}
          >
            Editor
          </button>
        </div>
      </header>

      <div className="main-content">
        {mode === 'play' ? (
          <Game 
            elements={elements} 
            recipes={recipes} 
            discovered={discovered} 
            onDiscover={handleDiscover}
          />
        ) : (
          <Editor 
            elements={elements} 
            setElements={setElements} 
            recipes={recipes} 
            setRecipes={setRecipes}
          />
        )}
      </div>
    </div>
  );
}

export default App;

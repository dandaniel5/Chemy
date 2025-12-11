import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

export default function Editor({ elements, setElements, recipes, setRecipes }) {
  const [newEl, setNewEl] = useState({ name: '', icon: '❓', description: '', category: 'compound' });
  const [newRecipe, setNewRecipe] = useState({ input1: '', input2: '', output: '' });

  const addElement = () => {
    if (!newEl.name) return;
    const id = newEl.name.toLowerCase().replace(/\s+/g, '-');
    if (elements.find(e => e.id === id)) {
      alert('Element already exists!');
      return;
    }
    setElements([...elements, { ...newEl, id }]);
    setNewEl({ name: '', icon: '❓', description: '', category: 'compound' });
  };

  const addRecipe = () => {
    if (!newRecipe.input1 || !newRecipe.input2 || !newRecipe.output) return;
    const recipeId = `r-${Date.now()}`;
    const newR = {
      id: recipeId,
      inputs: [newRecipe.input1, newRecipe.input2],
      output: newRecipe.output
    };
    setRecipes([...recipes, newR]);
    setNewRecipe({ input1: '', input2: '', output: '' });
  };

  const deleteElement = (id) => {
    if (confirm(`Delete element ${id}? This may break recipes.`)) {
      setElements(elements.filter(e => e.id !== id));
    }
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <div className="editor-container">
      <h2>Crafting Editor</h2>
      
      {/* Add Element */}
      <div className="editor-form">
        <h3>Add Element</h3>
        <div className="form-group">
          <label>Name</label>
          <input value={newEl.name} onChange={e => setNewEl({...newEl, name: e.target.value})} placeholder="e.g. Steam" />
        </div>
        <div className="form-group">
          <label>Icon (Emoji)</label>
          <input value={newEl.icon} onChange={e => setNewEl({...newEl, icon: e.target.value})} style={{width: '60px'}} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input value={newEl.description} onChange={e => setNewEl({...newEl, description: e.target.value})} placeholder="Description" />
        </div>
        <button onClick={addElement}><Plus size={16} /> Add Element</button>
      </div>

      {/* Add Recipe */}
      <div className="editor-form">
        <h3>Add Recipe</h3>
        <div className="form-group">
          <label>Input 1</label>
          <select value={newRecipe.input1} onChange={e => setNewRecipe({...newRecipe, input1: e.target.value})}>
            <option value="">Select...</option>
            {elements.map(e => <option key={e.id} value={e.id}>{e.icon} {e.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>+</label>
        </div>
        <div className="form-group">
          <label>Input 2</label>
          <select value={newRecipe.input2} onChange={e => setNewRecipe({...newRecipe, input2: e.target.value})}>
             <option value="">Select...</option>
            {elements.map(e => <option key={e.id} value={e.id}>{e.icon} {e.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>=</label>
        </div>
        <div className="form-group">
          <label>Output</label>
          <select value={newRecipe.output} onChange={e => setNewRecipe({...newRecipe, output: e.target.value})}>
             <option value="">Select...</option>
            {elements.map(e => <option key={e.id} value={e.id}>{e.icon} {e.name}</option>)}
          </select>
        </div>
        <button onClick={addRecipe}><Plus size={16} /> Add Recipe</button>
      </div>

      <h3>Elements</h3>
      <table className="crafting-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Name</th>
            <th>ID</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {elements.map(e => (
            <tr key={e.id}>
              <td style={{fontSize: '24px'}}>{e.icon}</td>
              <td>{e.name}</td>
              <td>{e.id}</td>
              <td>{e.category}</td>
              <td><button onClick={() => deleteElement(e.id)}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Recipes</h3>
      <table className="crafting-table">
          <thead>
            <tr>
              <th>Inputs</th>
              <th>Output</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => {
               const out = elements.find(e => e.id === r.output);
               const in1 = elements.find(e => e.id === r.inputs[0]);
               const in2 = elements.find(e => e.id === r.inputs[1]);
               return (
                 <tr key={r.id}>
                   <td>
                     {in1?.icon} {in1?.name} + {in2?.icon} {in2?.name}
                   </td>
                   <td>
                     {out?.icon} {out?.name}
                   </td>
                   <td><button onClick={() => deleteRecipe(r.id)}><Trash2 size={14} /></button></td>
                 </tr>
               );
            })}
          </tbody>
      </table>
    </div>
  );
}

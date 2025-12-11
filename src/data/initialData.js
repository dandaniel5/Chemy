export const defaultElements = [
  { id: 'fire', name: 'Fire', icon: '🔥', description: 'Hot and fiery', category: 'basic' },
  { id: 'water', name: 'Water', icon: '💧', description: 'Wet and fluid', category: 'basic' },
  { id: 'earth', name: 'Earth', icon: '🌍', description: 'Solid ground', category: 'basic' },
  { id: 'air', name: 'Air', icon: '💨', description: 'Gaseous', category: 'basic' },
  { id: 'steam', name: 'Steam', icon: '🌫️', description: 'Hot vapor', category: 'compound' },
  { id: 'mud', name: 'Mud', icon: '💩', description: 'Wet earth', category: 'compound' },
  { id: 'dust', name: 'Dust', icon: '✨', description: 'Fine particles', category: 'compound' },
  { id: 'rain', name: 'Rain', icon: '🌧️', description: 'Water falling', category: 'compound' },
  { id: 'energy', name: 'Energy', icon: '⚡', description: 'Pure power', category: 'basic' },
];

export const defaultRecipes = [
  { id: 'r1', inputs: ['fire', 'water'], output: 'steam' },
  { id: 'r2', inputs: ['earth', 'water'], output: 'mud' },
  { id: 'r3', inputs: ['air', 'earth'], output: 'dust' },
  { id: 'r4', inputs: ['water', 'air'], output: 'rain' },
];

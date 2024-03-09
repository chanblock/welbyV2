import { useContext } from 'react';
import { ChildsContext } from './ChildsProvider';

// Un hook personalizado que permite fácil acceso al Contexto de los niños
export function useChilds() {
  const context = useContext(ChildsContext);
  if (!context) {
    throw new Error('useChilds must be used within a ChildsProvider');
  }
  return context;
}

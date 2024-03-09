import React, { createContext, useState } from 'react';

// Crear el Contexto para los datos de los niños
export const ChildsContext = createContext();

// Crear un Provider personalizado para el Contexto
export function ChildsProvider(props) {
  const [childs, setChilds] = useState([]);
  return <ChildsContext.Provider value={{ childs, setChilds }} {...props} />;
}

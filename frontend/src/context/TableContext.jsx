import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredTable, setStoredTable } from '../utils/storage';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [tableNumber, setTableNumber] = useState('05');

  useEffect(() => {
    // Detect table parameter from URL (e.g., http://localhost:5173/?table=12)
    const urlParams = new URLSearchParams(window.location.search);
    const tableFromUrl = urlParams.get('table');

    if (tableFromUrl) {
      setTableNumber(tableFromUrl);
      setStoredTable(tableFromUrl);
    } else {
      const savedTable = getStoredTable();
      setTableNumber(savedTable);
    }
  }, []);

  const updateTable = (newTable) => {
    setTableNumber(newTable);
    setStoredTable(newTable);
  };

  return (
    <TableContext.Provider value={{ tableNumber, updateTable }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within TableProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDraftBillsStats } from '../utils/draftBillUtils';

const DraftContext = createContext();

export const useDraftContext = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraftContext must be used within a DraftProvider');
  }
  return context;
};

export const DraftProvider = ({ children }) => {
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    finalized: 0,
    sent: 0,
    totalValue: 0
  });

  const refreshStats = () => {
    const newStats = getDraftBillsStats();
    setStats(newStats);
  };

  useEffect(() => {
    refreshStats();
    
    // Listen for localStorage changes (cross-tab updates)
    const handleStorageChange = (e) => {
      if (e.key === 'draftMedicineBills') {
        refreshStats();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const value = {
    stats,
    refreshStats
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
};

export default DraftProvider;

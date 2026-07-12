"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en'); // Default: English

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  }, []);

  // Helper: returns the right string based on current language
  const t = useCallback(
    (vi, en) => language === 'vi' ? vi : en,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

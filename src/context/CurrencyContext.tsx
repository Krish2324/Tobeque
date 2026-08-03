import React, { createContext, useContext, useState, useEffect } from 'react';

const rawEnvUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${rawEnvUrl}/api`;

interface CurrencyContextType {
  currencySymbol: string;
  storeCurrency: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currencySymbol: '₹',
  storeCurrency: 'INR'
});

export const useCurrency = () => useContext(CurrencyContext);

const getSymbol = (currency: string) => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    default: return '₹';
  }
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeCurrency, setStoreCurrency] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings/public`);
        const data = await res.json();
        if (data.success && data.settings?.storeCurrency) {
          const curr = data.settings.storeCurrency;
          setStoreCurrency(curr);
          setCurrencySymbol(getSymbol(curr));
        }
      } catch (error) {
        console.error('Failed to fetch currency settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <CurrencyContext.Provider value={{ storeCurrency, currencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

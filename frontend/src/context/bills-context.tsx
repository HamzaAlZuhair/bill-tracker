import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';

interface BillsContextType {
  fetchBills: () => Promise<void>;
  bills: any[];
  loading: boolean;
}

const BillsContext = createContext<BillsContextType | undefined>(undefined);

export function BillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getAccessToken, refreshAccessToken } = useAuth();

  const fetchBills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bills/getbills`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`
         },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Fetched bills successfully:", data.bills);
        setBills(data.bills);
      } else if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          fetchBills(); // Retry fetching bills with the new token
        } else {
          console.error("Failed to refresh access token:", data.message);
        }
      } else {
        console.error("Failed to fetch bills:", data.message);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BillsContext.Provider value={{ fetchBills, bills, loading }}>
      {children}
    </BillsContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillsContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillsProvider');
  }
  return context;
}
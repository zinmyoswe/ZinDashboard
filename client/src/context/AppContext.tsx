import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  contactPerson: string;
  imageUrl: string;
  isActive: boolean;
}

interface AppContextType {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Supplier) => Promise<Supplier>;
  updateSupplier: (id: string, updatedSupplier: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/supplier`);
      setSuppliers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSupplier = async (supplier: Supplier) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/supplier`, supplier);
      const newSupplier = response.data;
      setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
      return newSupplier;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: string, updatedSupplier: Partial<Supplier>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/supplier/${id}`, updatedSupplier);
      const result = response.data;
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((sup) => (sup._id === id ? result : sup))
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/supplier/${id}`);
      setSuppliers((prevSuppliers) => prevSuppliers.filter((sup) => sup._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <AppContext.Provider
      value={{
        suppliers,
        loading,
        error,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: number;
  department: string;
  isActive: boolean;
  image: string;
}

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Purchase {
  _id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  status: string;
  date: string;
  notes?: string;
}

interface MarketingItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
}

interface MarketingOrder {
  _id: string;
  storeId?: string;
  storeName: string;
  campaignName?: string;
  items: MarketingItem[];
  totalAmount: number;
  status: 'Draft' | 'HandedOver';
  date: string;
  notes?: string;
}

interface AppContextType {
  suppliers: Supplier[];
  users: User[];
  purchases: Purchase[];
  marketingOrders: MarketingOrder[];
  loading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  addSupplier: (supplier: Supplier) => Promise<Supplier>;
  updateSupplier: (id: string, updatedSupplier: Partial<Supplier>) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<User>;
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  fetchPurchases: () => Promise<void>;
  addPurchase: (purchase: Omit<Purchase, '_id'>) => Promise<Purchase>;
  updatePurchase: (id: string, updatedPurchase: Partial<Purchase>) => Promise<Purchase>;
  deletePurchase: (id: string) => Promise<void>;
  fetchMarketingOrders: () => Promise<void>;
  addMarketingOrder: (order: Omit<MarketingOrder, '_id'>) => Promise<MarketingOrder>;
  updateMarketingOrder: (id: string, updatedOrder: Partial<MarketingOrder>) => Promise<MarketingOrder>;
  deleteMarketingOrder: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [marketingOrders, setMarketingOrders] = useState<MarketingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.url?.includes('/api/supplier') && !config.url?.includes('/api/user') && !config.url?.includes('/api/purchase')) {
          if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
          }
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token is invalid or expired, clear storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: User) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user`, user);
      const newUser = response.data;
      setUsers((prevUsers) => [...prevUsers, newUser]);
      return newUser;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, updatedUser: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/${id}`, updatedUser);
      const result = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === id ? result : user))
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/purchase`);
      setPurchases(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPurchase = async (purchase: Omit<Purchase, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/purchase`, purchase);
      const newPurchase = response.data;
      setPurchases((prevPurchases) => [...prevPurchases, newPurchase]);
      return newPurchase;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchase = async (id: string, updatedPurchase: Partial<Purchase>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/purchase/${id}`, updatedPurchase);
      const result = response.data;
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) => (purchase._id === id ? result : purchase))
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/purchase/${id}`);
      setPurchases((prevPurchases) => prevPurchases.filter((purchase) => purchase._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketingOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/marketing`);
      setMarketingOrders(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMarketingOrder = async (order: Omit<MarketingOrder, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/marketing`, order);
      const newOrder = response.data;
      setMarketingOrders((prevOrders) => [...prevOrders, newOrder]);
      return newOrder;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMarketingOrder = async (id: string, updatedOrder: Partial<MarketingOrder>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/marketing/${id}`, updatedOrder);
      const result = response.data;
      setMarketingOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === id ? result : order))
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMarketingOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/marketing/${id}`);
      setMarketingOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
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
        users,
        purchases,
        marketingOrders,
        loading,
        error,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
        fetchPurchases,
        addPurchase,
        updatePurchase,
        deletePurchase,
        fetchMarketingOrders,
        addMarketingOrder,
        updateMarketingOrder,
        deleteMarketingOrder,
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

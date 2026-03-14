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

interface InventoryItem {
  _id: string;
  productId: string;
  productName: string;
  sku?: string;
  stock: number;
  reorderLevel: number;
  location?: string;
  imageUrl?: string;
  notes?: string;
}

interface PurchaseRequisition {
  _id: string;
  itemId: string;
  itemName: string;
  requestedQty: number;
  status: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceInvoice {
  _id: string;
  invoiceNumber: string;
  type: 'Customer' | 'Supplier';
  relatedPurchaseId?: string;
  grnNumber?: string;
  supplierInvoiceNumber?: string;
  amount: number;
  dueDate?: string;
  status: 'Unpaid' | 'Paid' | 'Overdue';
  payments?: Array<{
    amount: number;
    date: string;
    method?: string;
    note?: string;
  }>;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductionOrder {
  _id: string;
  orderNumber: string;
  productId?: string;
  productName: string;
  quantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  plannedStart?: string;
  plannedEnd?: string;
  materials?: Array<{
    materialId?: string;
    materialName: string;
    requiredQty: number;
    consumedQty: number;
  }>;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface LogisticsShipment {
  _id: string;
  referenceId?: string;
  carrierType: 'Truck' | 'Courier' | '3PL';
  carrierName: string;
  scheduledDate: string;
  status: 'Scheduled' | 'InTransit' | 'Delivered';
  podUrl?: string;
  notes?: string;
  createdBy?: string;
}

interface AppContextType {
  suppliers: Supplier[];
  users: User[];
  purchases: Purchase[];
  marketingOrders: MarketingOrder[];
  inventoryItems: InventoryItem[];
  purchaseRequisitions: PurchaseRequisition[];
  productionOrders: ProductionOrder[];
  financeInvoices: FinanceInvoice[];
  logisticsShipments: LogisticsShipment[];
  qualityInspections: QualityInspection[];
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
  fetchInventoryItems: () => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, '_id'>) => Promise<InventoryItem>;
  updateInventoryItem: (id: string, updatedItem: Partial<InventoryItem>) => Promise<InventoryItem>;
  deleteInventoryItem: (id: string) => Promise<void>;
  fetchPurchaseRequisitions: () => Promise<void>;
  addPurchaseRequisition: (req: Omit<PurchaseRequisition, '_id'>) => Promise<PurchaseRequisition>;
  updatePurchaseRequisition: (id: string, updatedReq: Partial<PurchaseRequisition>) => Promise<PurchaseRequisition>;
  deletePurchaseRequisition: (id: string) => Promise<void>;
  fetchProductionOrders: () => Promise<void>;
  addProductionOrder: (order: Omit<ProductionOrder, '_id' | 'createdAt' | 'updatedAt'>) => Promise<ProductionOrder>;
  updateProductionOrder: (id: string, updatedOrder: Partial<ProductionOrder>) => Promise<ProductionOrder>;
  deleteProductionOrder: (id: string) => Promise<void>;
  fetchFinanceInvoices: () => Promise<void>;
  addFinanceInvoice: (invoice: Omit<FinanceInvoice, '_id' | 'createdAt' | 'updatedAt'>) => Promise<FinanceInvoice>;
  updateFinanceInvoice: (id: string, updatedInvoice: Partial<FinanceInvoice>) => Promise<FinanceInvoice>;
  deleteFinanceInvoice: (id: string) => Promise<void>;
  payFinanceInvoice: (id: string, payment: { amount?: number; method?: string; note?: string }) => Promise<FinanceInvoice>;
  fetchQualityInspections: () => Promise<void>;
  addQualityInspection: (inspection: Omit<QualityInspection, '_id' | 'createdAt' | 'updatedAt'>) => Promise<QualityInspection>;
  updateQualityInspection: (id: string, updatedInspection: Partial<QualityInspection>) => Promise<QualityInspection>;
  deleteQualityInspection: (id: string) => Promise<void>;
  updateInspectionStatus: (id: string, status: QualityInspection['status'], defectReports?: string[]) => Promise<QualityInspection>;
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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [purchaseRequisitions, setPurchaseRequisitions] = useState<PurchaseRequisition[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [financeInvoices, setFinanceInvoices] = useState<FinanceInvoice[]>([]);
  const [logisticsShipments, setLogisticsShipments] = useState<LogisticsShipment[]>([]);
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>([]);
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

  const fetchInventoryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/inventory`);
      setInventoryItems(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/inventory`, item);
      const newItem = response.data;
      setInventoryItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (id: string, updatedItem: Partial<InventoryItem>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/inventory/${id}`, updatedItem);
      const result = response.data;
      setInventoryItems((prev) => prev.map((item) => (item._id === id ? result : item)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/inventory/${id}`);
      setInventoryItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseRequisitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/requisition`);
      setPurchaseRequisitions(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPurchaseRequisition = async (req: Omit<PurchaseRequisition, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/requisition`, req);
      const newReq = response.data;
      setPurchaseRequisitions((prev) => [...prev, newReq]);
      return newReq;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseRequisition = async (id: string, updatedReq: Partial<PurchaseRequisition>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/requisition/${id}`, updatedReq);
      const result = response.data;
      setPurchaseRequisitions((prev) => prev.map((req) => (req._id === id ? result : req)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseRequisition = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/requisition/${id}`);
      setPurchaseRequisitions((prev) => prev.filter((req) => req._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductionOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/production`);
      setProductionOrders(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProductionOrder = async (order: Omit<ProductionOrder, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/production`, order);
      const newOrder = response.data;
      setProductionOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProductionOrder = async (id: string, updatedOrder: Partial<ProductionOrder>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/production/${id}`, updatedOrder);
      const result = response.data;
      setProductionOrders((prev) => prev.map((ord) => (ord._id === id ? result : ord)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProductionOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/production/${id}`);
      setProductionOrders((prev) => prev.filter((ord) => ord._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchFinanceInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/finance`);
      setFinanceInvoices(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFinanceInvoice = async (invoice: Omit<FinanceInvoice, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/finance`, invoice);
      const newInvoice = response.data;
      setFinanceInvoices((prev) => [...prev, newInvoice]);
      return newInvoice;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFinanceInvoice = async (id: string, updatedInvoice: Partial<FinanceInvoice>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/finance/${id}`, updatedInvoice);
      const result = response.data;
      setFinanceInvoices((prev) => prev.map((inv) => (inv._id === id ? result : inv)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFinanceInvoice = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/finance/${id}`);
      setFinanceInvoices((prev) => prev.filter((inv) => inv._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const payFinanceInvoice = async (id: string, payment: { amount?: number; method?: string; note?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/finance/${id}/pay`, payment);
      const result = response.data;
      setFinanceInvoices((prev) => prev.map((inv) => (inv._id === id ? result : inv)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQualityInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/quality`);
      setQualityInspections(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addQualityInspection = async (inspection: Omit<QualityInspection, '_id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quality`, inspection);
      const newInspection = response.data;
      setQualityInspections((prev) => [...prev, newInspection]);
      return newInspection;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQualityInspection = async (id: string, updatedInspection: Partial<QualityInspection>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/quality/${id}`, updatedInspection);
      const result = response.data;
      setQualityInspections((prev) => prev.map((ins) => (ins._id === id ? result : ins)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQualityInspection = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/quality/${id}`);
      setQualityInspections((prev) => prev.filter((ins) => ins._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInspectionStatus = async (id: string, status: QualityInspection['status'], defectReports?: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/quality/${id}/status`, { status, defectReports });
      const result = response.data;
      setQualityInspections((prev) => prev.map((ins) => (ins._id === id ? result : ins)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchLogisticsShipments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/logistics`);
      setLogisticsShipments(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLogisticsShipment = async (shipment: Omit<LogisticsShipment, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/logistics`, shipment);
      const newShipment = response.data;
      setLogisticsShipments((prev) => [...prev, newShipment]);
      return newShipment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLogisticsShipment = async (id: string, updatedShipment: Partial<LogisticsShipment>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/logistics/${id}`, updatedShipment);
      const result = response.data;
      setLogisticsShipments((prev) => prev.map((shipment) => (shipment._id === id ? result : shipment)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLogisticsShipment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/api/logistics/${id}`);
      setLogisticsShipments((prev) => prev.filter((shipment) => shipment._id !== id));
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
        inventoryItems,
        purchaseRequisitions,
        productionOrders,
        financeInvoices,
        logisticsShipments,
        qualityInspections,
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
        fetchInventoryItems,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        fetchPurchaseRequisitions,
        addPurchaseRequisition,
        updatePurchaseRequisition,
        deletePurchaseRequisition,
        fetchProductionOrders,
        addProductionOrder,
        updateProductionOrder,
        deleteProductionOrder,
        fetchFinanceInvoices,
        addFinanceInvoice,
        updateFinanceInvoice,
        deleteFinanceInvoice,
        payFinanceInvoice,
        fetchQualityInspections,
        addQualityInspection,
        updateQualityInspection,
        deleteQualityInspection,
        updateInspectionStatus,
        fetchLogisticsShipments,
        addLogisticsShipment,
        updateLogisticsShipment,
        deleteLogisticsShipment,
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

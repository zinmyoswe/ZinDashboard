import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Plus, Pencil, Trash2, ArrowRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

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

const statusOptions = ['Draft', 'HandedOver'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Draft':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
          {status}
        </span>
      );
    case 'HandedOver':
      return (
        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          {status}
        </span>
      );
    default:
      return <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">{status}</span>;
  }
};

const Marketing = () => {
  const {
    marketingOrders,
    loading,
    error,
    fetchMarketingOrders,
    addMarketingOrder,
    updateMarketingOrder,
    deleteMarketingOrder,
  } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MarketingOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<MarketingOrder | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [newItem, setNewItem] = useState({ productName: '', quantity: 0, price: 0, imageUrl: '' });
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<Omit<MarketingOrder, '_id'>>({
    storeId: '',
    storeName: '',
    campaignName: '',
    items: [],
    totalAmount: 0,
    status: 'Draft',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchMarketingOrders();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.total, 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.items]);

  const resetForm = () => {
    setFormData({
      storeId: '',
      storeName: '',
      campaignName: '',
      items: [],
      totalAmount: 0,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setNewItem({ productName: '', quantity: 0, price: 0, imageUrl: '' });
    setEditingItemIndex(null);
    setEditingOrder(null);
  };

  const handleOpenDialog = (order?: MarketingOrder) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        storeId: order.storeId || '',
        storeName: order.storeName,
        campaignName: order.campaignName || '',
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        date: order.date,
        notes: order.notes || '',
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingOrder) {
        await updateMarketingOrder(editingOrder._id, formData);
        toast.success('Marketing order updated successfully');
      } else {
        await addMarketingOrder(formData);
        toast.success('Marketing order created successfully');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save marketing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMarketingOrder(id);
      toast.success('Marketing order deleted successfully');
    } catch (error) {
      toast.error('Failed to delete marketing order');
    }
  };

  const handleViewDialog = (order: MarketingOrder) => {
    setViewingOrder(order);
    setViewDialogOpen(true);
  };

  const handleHandOver = async (order: MarketingOrder) => {
    try {
      await updateMarketingOrder(order._id, { status: 'HandedOver' });
      toast.success('Order handed over to Sales');
    } catch (error) {
      toast.error('Failed to hand over order');
    }
  };

  const handleAddItem = () => {
    if (newItem.productName && newItem.quantity > 0 && newItem.price > 0) {
      const total = newItem.quantity * newItem.price;
      const item: MarketingItem = {
        productId: '',
        productName: newItem.productName,
        quantity: newItem.quantity,
        price: newItem.price,
        total,
        imageUrl: newItem.imageUrl || undefined,
      };
      if (editingItemIndex !== null && editingItemIndex >= 0 && editingItemIndex < formData.items.length) {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map((it, i) => (i === editingItemIndex ? item : it)),
        }));
        setEditingItemIndex(null);
      } else {
        setFormData(prev => ({ ...prev, items: [...prev.items, item] }));
      }
      setNewItem({ productName: '', quantity: 0, price: 0, imageUrl: '' });
    }
  };

  const handleEditItem = (index: number) => {
    const item = formData.items[index];
    if (!item) return;
    setNewItem({ productName: item.productName, quantity: item.quantity, price: item.price, imageUrl: item.imageUrl || '' });
    setEditingItemIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingItemIndex(null);
    setNewItem({ productName: '', quantity: 0, price: 0, imageUrl: '' });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  if (loading || showSkeleton) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className='bg-muted/10 min-h-[100vh] flex-1 rounded-xl shadow-2xl md:min-h-min'>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="space-y-4">
              <div className="flex space-x-4 pb-2 border-b">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className='bg-muted/10 min-h-[100vh] flex-1 rounded-xl shadow-2xl md:min-h-min'>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Marketing Orders</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[1250px]">
                <DialogHeader>
                  <DialogTitle>{editingOrder ? 'Edit Marketing Order' : 'New Marketing Order'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Store Name"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Campaign Name"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  />
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as 'Draft' | 'HandedOver' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <Input
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />

                  <div className="rounded border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">Items</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-muted-foreground">Product</label>
                        <Input
                          placeholder="Product Name"
                          value={newItem.productName}
                          onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-muted-foreground">Quantity</label>
                        <Input
                          placeholder="Quantity"
                          type="number"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-muted-foreground">Price</label>
                        <Input
                          placeholder="Price"
                          type="number"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-muted-foreground">Image URL</label>
                        <Input
                          placeholder="Image URL"
                          value={newItem.imageUrl}
                          onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button type="button" onClick={handleAddItem}>
                        {editingItemIndex !== null ? 'Update item' : 'Add item'}
                      </Button>
                      {editingItemIndex !== null && (
                        <Button variant="outline" type="button" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      )}
                    </div>
                    {formData.items.length > 0 && (
                      <div className="mt-3 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>Image</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {formData.items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.productName}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                  ) : (
                                    '-'
                                  )}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.total}</TableCell>
                                <TableCell className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditItem(index)}>
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleRemoveItem(index)}>
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Spinner className="mr-2" />}
                      {editingOrder ? 'Update Order' : 'Save Order'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketingOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.storeName}</TableCell>
                  <TableCell>{order.campaignName || '-'}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewDialog(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === 'Draft' && (
                      <Button size="sm" variant="secondary" onClick={() => handleHandOver(order)}>
                        <ArrowRight className="h-4 w-4" />
                        Hand Over
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(order)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeletingOrderId(order._id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Marketing Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this marketing order? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  if (deletingOrderId) {
                    handleDelete(deletingOrderId);
                  }
                  setDeleteDialogOpen(false);
                }}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Marketing Order Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Store</div>
                  <div className="text-sm">{viewingOrder?.storeName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Campaign</div>
                  <div className="text-sm">{viewingOrder?.campaignName || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className="text-sm">{viewingOrder ? getStatusBadge(viewingOrder.status) : '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Date</div>
                  <div className="text-sm">{viewingOrder ? new Date(viewingOrder.date).toLocaleDateString() : '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm">{viewingOrder?.notes || '-'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Items</div>
                  <div className="mt-2 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Image</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewingOrder?.items.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Marketing;

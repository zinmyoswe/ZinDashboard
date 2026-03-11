import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
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

interface InventoryForm {
  productId: string;
  productName: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  location: string;
  imageUrl: string;
  notes: string;
}

const Inventory = () => {
  const {
    inventoryItems,
    loading,
    error,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useAppContext();

  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [formData, setFormData] = useState<InventoryForm>({
    productId: '',
    productName: '',
    sku: '',
    stock: 0,
    reorderLevel: 0,
    location: '',
    imageUrl: '',
    notes: '',
  });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      productId: '',
      productName: '',
      sku: '',
      stock: 0,
      reorderLevel: 0,
      location: '',
      imageUrl: '',
      notes: '',
    });
    setEditingItemId(null);
  };

  const handleOpenDialog = (item?: typeof inventoryItems[number]) => {
    if (item) {
      setEditingItemId(item._id);
      setFormData({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku || '',
        stock: item.stock,
        reorderLevel: item.reorderLevel,
        location: item.location || '',
        imageUrl: item.imageUrl || '',
        notes: item.notes || '',
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
      if (editingItemId) {
        await updateInventoryItem(editingItemId, formData);
        toast.success('Inventory item updated');
      } else {
        await addInventoryItem(formData);
        toast.success('Inventory item added');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem(id);
      toast.success('Inventory item deleted');
    } catch (error) {
      toast.error('Failed to delete inventory item');
    }
  };

  const handleReceive = async (itemId: string) => {
    const qty = Number(prompt('Enter quantity received', '0'));
    if (!qty || qty <= 0) return;
    const item = inventoryItems.find((i) => i._id === itemId);
    if (!item) return;
    await updateInventoryItem(itemId, { stock: item.stock + qty });
    toast.success('Stock updated (received)');
  };

  const handlePick = async (itemId: string) => {
    const qty = Number(prompt('Enter quantity picked', '0'));
    if (!qty || qty <= 0) return;
    const item = inventoryItems.find((i) => i._id === itemId);
    if (!item) return;
    await updateInventoryItem(itemId, { stock: Math.max(0, item.stock - qty) });
    toast.success('Stock updated (picked)');
  };

  const handleCreateRequisition = (itemId: string) => {
    navigate(`/admin/requisitions?itemId=${itemId}`);
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
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center py-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex space-x-2">
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
            <h1 className="text-2xl font-bold">Inventory</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingItemId ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                  <Input
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <Input
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-muted-foreground">Quantity</label>
                      <Input
                        placeholder="Stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-muted-foreground">Reorder Level</label>
                      <Input
                        placeholder="Reorder Level"
                        type="number"
                        value={formData.reorderLevel}
                        onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-muted-foreground">Product ID</label>
                      <Input
                        placeholder="Product ID"
                        value={formData.productId}
                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      />
                    </div>
                  </div>
                  <Input
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Spinner className="mr-2" />}
                      {editingItemId ? 'Update Item' : 'Save Item'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => {
                const lowStock = item.stock <= item.reorderLevel;
                return (
                  <TableRow key={item._id}>
                    <TableCell className="flex items-center gap-2">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted" />
                      )}
                      <div>
                        <div>{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.sku || '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={lowStock ? 'text-amber-600 font-semibold' : ''}>
                        {item.stock}
                      </div>
                    </TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>{item.location || '-'}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReceive(item._id)}>
                        Receive
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePick(item._id)}>
                        Pick
                      </Button>
                      {lowStock && (
                        <Button size="sm" onClick={() => handleCreateRequisition(item._id)}>
                          Create PR
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleOpenDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeletingItemId(item._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this inventory item? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (deletingItemId) {
                      handleDelete(deletingItemId);
                    }
                    setDeleteDialogOpen(false);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

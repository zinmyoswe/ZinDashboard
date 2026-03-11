import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const statusOptions = ['Pending', 'Submitted', 'Approved', 'Rejected'] as const;

type Status = (typeof statusOptions)[number];

interface RequisitionForm {
  itemId: string;
  itemName: string;
  requestedQty: number;
  status: Status;
  notes: string;
}

const Requisitions = () => {
  const {
    purchaseRequisitions,
    inventoryItems,
    loading,
    error,
    fetchPurchaseRequisitions,
    fetchInventoryItems,
    addPurchaseRequisition,
    updatePurchaseRequisition,
    deletePurchaseRequisition,
  } = useAppContext();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemIdFromQuery = searchParams.get('itemId');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReq, setEditingReq] = useState<RequisitionForm | null>(null);
  const [editingReqId, setEditingReqId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReqId, setDeletingReqId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [formData, setFormData] = useState<RequisitionForm>({
    itemId: '',
    itemName: '',
    requestedQty: 0,
    status: 'Pending',
    notes: '',
  });

  useEffect(() => {
    fetchPurchaseRequisitions();
    fetchInventoryItems();
  }, []);

  useEffect(() => {
    if (!itemIdFromQuery) return;
    const item = inventoryItems.find((i) => i._id === itemIdFromQuery);
    if (!item) return;

    setFormData((prev) => ({
      ...prev,
      itemId: item._id,
      itemName: item.productName,
    }));
    setDialogOpen(true);
  }, [itemIdFromQuery, inventoryItems]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      itemId: '',
      itemName: '',
      requestedQty: 0,
      status: 'Pending',
      notes: '',
    });
    setEditingReq(null);
    setEditingReqId(null);
  };

  const handleOpenDialog = (req?: typeof purchaseRequisitions[number]) => {
    if (req) {
      setEditingReqId(req._id);
      setEditingReq({
        itemId: req.itemId,
        itemName: req.itemName,
        requestedQty: req.requestedQty,
        status: req.status as Status,
        notes: req.notes || '',
      });
      setFormData({
        itemId: req.itemId,
        itemName: req.itemName,
        requestedQty: req.requestedQty,
        status: req.status as Status,
        notes: req.notes || '',
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
      if (editingReqId) {
        await updatePurchaseRequisition(editingReqId, formData);
        toast.success('Purchase requisition updated');
      } else {
        await addPurchaseRequisition(formData);
        toast.success('Purchase requisition created');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save requisition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePurchaseRequisition(id);
      toast.success('Purchase requisition deleted');
    } catch (error) {
      toast.error('Failed to delete requisition');
    }
  };

  const handleItemSelection = (itemId: string) => {
    const item = inventoryItems.find((i) => i._id === itemId);
    setFormData((prev) => ({
      ...prev,
      itemId,
      itemName: item?.productName || '',
    }));
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
            <h1 className="text-2xl font-bold">Purchase Requisitions</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Requisition
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingReqId ? 'Edit Requisition' : 'New Requisition'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select value={formData.itemId} onValueChange={handleItemSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inventory item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.productName} (Stock: {item.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-muted-foreground">Quantity</label>
                    <Input
                      placeholder="Requested Quantity"
                      type="number"
                      value={formData.requestedQty}
                      onChange={(e) => setFormData({ ...formData, requestedQty: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Status })}>
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
                      {editingReqId ? 'Update Requisition' : 'Save Requisition'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Requested Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseRequisitions.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.itemName}</TableCell>
                  <TableCell>{req.requestedQty}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(req)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeletingReqId(req._id);
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
                <AlertDialogTitle>Delete Requisition</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this purchase requisition? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (deletingReqId) {
                      handleDelete(deletingReqId);
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

export default Requisitions;

import { useEffect, useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
import { Plus, Pencil, Trash2, Play, Pause, CheckSquare, Truck, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

interface BOMItem {
  materialName: string;
  requiredQty: number;
  consumedQty: number;
}

interface ProductionForm {
  orderNumber: string;
  productName: string;
  quantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  plannedStart: string;
  plannedEnd: string;
  notes: string;
  materials: BOMItem[];
}

const statusOptions = ['PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'] as const;

const Production = () => {
  const {
    productionOrders,
    loading,
    error,
    fetchProductionOrders,
    addProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
  } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [formData, setFormData] = useState<ProductionForm>({
    orderNumber: '',
    productName: '',
    quantity: 1,
    status: 'PLANNED',
    plannedStart: new Date().toISOString().split('T')[0],
    plannedEnd: new Date().toISOString().split('T')[0],
    notes: '',
    materials: [],
  });

  useEffect(() => {
    fetchProductionOrders();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      orderNumber: '',
      productName: '',
      quantity: 1,
      status: 'PLANNED',
      plannedStart: new Date().toISOString().split('T')[0],
      plannedEnd: new Date().toISOString().split('T')[0],
      notes: '',
      materials: [],
    });
    setEditingId(null);
  };

  const handleOpenDialog = (order?: typeof productionOrders[number]) => {
    if (order) {
      setEditingId(order._id);
      setFormData({
        orderNumber: order.orderNumber,
        productName: order.productName,
        quantity: order.quantity,
        status: order.status,
        plannedStart: order.plannedStart ? order.plannedStart.split('T')[0] : new Date().toISOString().split('T')[0],
        plannedEnd: order.plannedEnd ? order.plannedEnd.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: order.notes || '',
        materials: order.materials?.map((m) => ({
          materialName: m.materialName,
          requiredQty: m.requiredQty,
          consumedQty: m.consumedQty,
        })) || [],
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
      const payload = {
        ...formData,
        materials: formData.materials.map((mat) => ({
          ...mat,
          requiredQty: Number(mat.requiredQty),
          consumedQty: Number(mat.consumedQty),
        })),
      };

      if (editingId) {
        await updateProductionOrder(editingId, payload);
        toast.success('Production order updated');
      } else {
        await addProductionOrder(payload);
        toast.success('Production order created');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save production order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductionOrder(id);
      toast.success('Production order deleted');
    } catch (error) {
      toast.error('Failed to delete production order');
    }
  };

  const handleChangeStatus = async (orderId: string, status: ProductionForm['status']) => {
    try {
      await updateProductionOrder(orderId, { status });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendToWarehouse = async (orderId: string) => {
    try {
      await updateProductionOrder(orderId, {
        status: 'COMPLETED',
        sentToWarehouseAt: new Date().toISOString(),
      } as any);
      toast.success('Finished goods sent to warehouse');
    } catch (error) {
      toast.error('Failed to send goods to warehouse');
    }
  };

  const handleView = (id: string) => {
    setViewingId(id);
  };

  const viewedOrder = useMemo(
    () => productionOrders.find((order) => order._id === viewingId),
    [viewingId, productionOrders]
  );

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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-24" />
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
            <h1 className="text-2xl font-bold">Production Management</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Production Order' : 'New Production Order'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Order Number"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    required
                  />

                  <Input
                    placeholder="Product Name"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                  />

                  <Input
                    placeholder="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    required
                  />

                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ProductionForm['status'] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Planned Start"
                      type="date"
                      value={formData.plannedStart}
                      onChange={(e) => setFormData({ ...formData, plannedStart: e.target.value })}
                    />
                    <Input
                      placeholder="Planned End"
                      type="date"
                      value={formData.plannedEnd}
                      onChange={(e) => setFormData({ ...formData, plannedEnd: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Bill of Materials (BOM)</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            materials: [
                              ...prev.materials,
                              { materialName: '', requiredQty: 0, consumedQty: 0 },
                            ],
                          }))
                        }
                      >
                        Add Material
                      </Button>
                    </div>
                    {formData.materials.map((material, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <Input
                          placeholder="Material"
                          value={material.materialName}
                          onChange={(e) => {
                            const updated = [...formData.materials];
                            updated[index].materialName = e.target.value;
                            setFormData({ ...formData, materials: updated });
                          }}
                        />
                        <Input
                          placeholder="Required"
                          type="number"
                          value={material.requiredQty}
                          onChange={(e) => {
                            const updated = [...formData.materials];
                            updated[index].requiredQty = Number(e.target.value);
                            setFormData({ ...formData, materials: updated });
                          }}
                        />
                        <Input
                          placeholder="Consumed"
                          type="number"
                          value={material.consumedQty}
                          onChange={(e) => {
                            const updated = [...formData.materials];
                            updated[index].consumedQty = Number(e.target.value);
                            setFormData({ ...formData, materials: updated });
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = formData.materials.filter((_, i) => i !== index);
                            setFormData({ ...formData, materials: updated });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
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
                      {editingId ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productionOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {order.plannedStart ? new Date(order.plannedStart).toLocaleDateString() : '-'}
                    {' - '}
                    {order.plannedEnd ? new Date(order.plannedEnd).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(order._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(order)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSendToWarehouse(order._id)}
                    >
                      <Truck className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      setDeletingId(order._id);
                      setDeleteDialogOpen(true);
                    }}>
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
                <AlertDialogTitle>Delete Production Order</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this production order? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (deletingId) {
                      handleDelete(deletingId);
                    }
                    setDeleteDialogOpen(false);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {viewingId && (
            <Dialog open={Boolean(viewingId)} onOpenChange={() => setViewingId(null)}>
              <DialogContent className="max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Production Order Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Order Number</div>
                    <div className="text-sm">{viewedOrder?.orderNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Product</div>
                    <div className="text-sm">{viewedOrder?.productName || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">{viewedOrder?.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Quantity</div>
                    <div className="text-sm">{viewedOrder?.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Planned Dates</div>
                    <div className="text-sm">
                      {viewedOrder?.plannedStart ? new Date(viewedOrder.plannedStart).toLocaleDateString() : '-'}
                      {' - '}
                      {viewedOrder?.plannedEnd ? new Date(viewedOrder.plannedEnd).toLocaleDateString() : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Materials (BOM)</div>
                    <div className="text-sm">
                      {viewedOrder?.materials && viewedOrder.materials.length ? (
                        <ul className="list-disc pl-5">
                          {viewedOrder.materials.map((mat, idx) => (
                            <li key={idx}>
                              {mat.materialName} - required {mat.requiredQty} / consumed {mat.consumedQty}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{viewedOrder?.notes || '-'}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" onClick={() => setViewingId(null)}>
                    Close
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (viewedOrder) {
                        handleChangeStatus(viewedOrder._id, 'IN_PROGRESS');
                      }
                      setViewingId(null);
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (viewedOrder) {
                        handleChangeStatus(viewedOrder._id, 'PAUSED');
                      }
                      setViewingId(null);
                    }}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (viewedOrder) {
                        handleChangeStatus(viewedOrder._id, 'COMPLETED');
                      }
                      setViewingId(null);
                    }}
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Production;

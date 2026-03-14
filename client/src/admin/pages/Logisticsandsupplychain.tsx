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
import { Plus, Pencil, Trash2, Eye, Check } from 'lucide-react';
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

const carrierOptions = ['Truck', 'Courier', '3PL'] as const;
const statusOptions = ['Scheduled', 'InTransit', 'Delivered'] as const;

type CarrierType = (typeof carrierOptions)[number];
type StatusType = (typeof statusOptions)[number];

interface LogisticsShipmentForm {
  referenceId: string;
  carrierType: CarrierType;
  carrierName: string;
  scheduledDate: string;
  status: StatusType;
  podUrl: string;
  notes: string;
}

const Logisticsandsupplychain = () => {
  const {
    logisticsShipments,
    loading,
    error,
    fetchLogisticsShipments,
    addLogisticsShipment,
    updateLogisticsShipment,
    deleteLogisticsShipment,
  } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [formData, setFormData] = useState<LogisticsShipmentForm>({
    referenceId: '',
    carrierType: 'Truck',
    carrierName: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    podUrl: '',
    notes: '',
  });

  useEffect(() => {
    fetchLogisticsShipments();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      referenceId: '',
      carrierType: 'Truck',
      carrierName: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      podUrl: '',
      notes: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (shipment?: typeof logisticsShipments[number]) => {
    if (shipment) {
      setEditingId(shipment._id);
      setFormData({
        referenceId: shipment.referenceId || '',
        carrierType: shipment.carrierType,
        carrierName: shipment.carrierName,
        scheduledDate: shipment.scheduledDate.split('T')[0],
        status: shipment.status,
        podUrl: shipment.podUrl || '',
        notes: shipment.notes || '',
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
      if (editingId) {
        await updateLogisticsShipment(editingId, formData);
        toast.success('Shipment updated');
      } else {
        await addLogisticsShipment(formData);
        toast.success('Shipment scheduled');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save shipment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLogisticsShipment(id);
      toast.success('Shipment deleted');
    } catch (error) {
      toast.error('Failed to delete shipment');
    }
  };

  const handleMarkDelivered = async (shipment: typeof logisticsShipments[number]) => {
    try {
      await updateLogisticsShipment(shipment._id, { status: 'Delivered' });
      toast.success('Marked as delivered');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleView = (id: string) => {
    setViewingId(id);
  };

  const viewedShipment = logisticsShipments.find((s) => s._id === viewingId);

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
                  <Skeleton className="h-4 w-24" />
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
            <h1 className="text-2xl font-bold">Logistics & Supply Chain</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Delivery
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Delivery' : 'New Delivery'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Reference ID (order/requisition)"
                    value={formData.referenceId}
                    onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                  />

                  <Select value={formData.carrierType} onValueChange={(value) => setFormData({ ...formData, carrierType: value as CarrierType })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Carrier Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {carrierOptions.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Carrier Name"
                    value={formData.carrierName}
                    onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                    required
                  />

                  <Input
                    placeholder="Scheduled Date"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  />

                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as StatusType })}>
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
                    placeholder="Proof of Delivery URL"
                    value={formData.podUrl}
                    onChange={(e) => setFormData({ ...formData, podUrl: e.target.value })}
                  />

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
                <TableHead>Reference</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>POD</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logisticsShipments.map((shipment) => (
                <TableRow key={shipment._id}>
                  <TableCell>{shipment.referenceId || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{shipment.carrierName}</span>
                      <span className="text-xs text-muted-foreground">{shipment.carrierType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{shipment.status}</TableCell>
                  <TableCell>{new Date(shipment.scheduledDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {shipment.podUrl ? (
                      <a href={shipment.podUrl} className="text-primary underline" target="_blank" rel="noreferrer">
                        View POD
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(shipment._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {shipment.status !== 'Delivered' && (
                      <Button size="sm" variant="secondary" onClick={() => handleMarkDelivered(shipment)}>
                        <Check className="h-4 w-4" />
                        Delivered
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(shipment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeletingId(shipment._id);
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
                <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this shipment? This action cannot be undone.
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
                  <DialogTitle>Shipment Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Reference ID</div>
                    <div className="text-sm">{viewedShipment?.referenceId || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Carrier</div>
                    <div className="text-sm">{viewedShipment?.carrierName} ({viewedShipment?.carrierType})</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">{viewedShipment?.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Scheduled Date</div>
                    <div className="text-sm">{viewedShipment ? new Date(viewedShipment.scheduledDate).toLocaleDateString() : '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Proof of Delivery</div>
                    <div className="text-sm">
                      {viewedShipment?.podUrl ? (
                        <a href={viewedShipment.podUrl} className="text-primary underline" target="_blank" rel="noreferrer">
                          View POD
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{viewedShipment?.notes || '-'}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button onClick={() => setViewingId(null)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logisticsandsupplychain;

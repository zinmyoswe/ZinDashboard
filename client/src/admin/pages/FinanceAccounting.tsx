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

const invoiceTypes = ['Customer', 'Supplier'] as const;
const statusOptions = ['Unpaid', 'Paid', 'Overdue'] as const;

type InvoiceType = (typeof invoiceTypes)[number];
type StatusType = (typeof statusOptions)[number];

interface InvoiceForm {
  invoiceNumber: string;
  type: InvoiceType;
  relatedPurchaseId: string;
  grnNumber: string;
  supplierInvoiceNumber: string;
  amount: number;
  dueDate: string;
  status: StatusType;
  notes: string;
}

const FinanceAccounting = () => {
  const {
    financeInvoices,
    loading,
    error,
    fetchFinanceInvoices,
    addFinanceInvoice,
    updateFinanceInvoice,
    deleteFinanceInvoice,
    payFinanceInvoice,
  } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payMethod, setPayMethod] = useState('');
  const [payNote, setPayNote] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [formData, setFormData] = useState<InvoiceForm>({
    invoiceNumber: '',
    type: 'Customer',
    relatedPurchaseId: '',
    grnNumber: '',
    supplierInvoiceNumber: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'Unpaid',
    notes: '',
  });

  useEffect(() => {
    fetchFinanceInvoices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      type: 'Customer',
      relatedPurchaseId: '',
      grnNumber: '',
      supplierInvoiceNumber: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Unpaid',
      notes: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (invoice?: typeof financeInvoices[number]) => {
    if (invoice) {
      setEditingId(invoice._id);
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        type: invoice.type,
        relatedPurchaseId: invoice.relatedPurchaseId || '',
        grnNumber: invoice.grnNumber || '',
        supplierInvoiceNumber: invoice.supplierInvoiceNumber || '',
        amount: invoice.amount,
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        status: invoice.status,
        notes: invoice.notes || '',
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
        await updateFinanceInvoice(editingId, formData);
        toast.success('Invoice updated');
      } else {
        await addFinanceInvoice(formData);
        toast.success('Invoice created');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFinanceInvoice(id);
      toast.success('Invoice deleted');
    } catch (error) {
      toast.error('Failed to delete invoice');
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      await payFinanceInvoice(invoiceId, { amount: undefined, method: 'Manual', note: 'Marked paid by Finance' });
      toast.success('Invoice marked as paid');
    } catch (error) {
      toast.error('Failed to mark invoice paid');
    }
  };

  const handleOpenPaymentDialog = (id: string, amount: number) => {
    setPayingId(id);
    setPayAmount(amount);
    setPayMethod('');
    setPayNote('');
    setPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = async () => {
    if (!payingId) return;

    try {
      await payFinanceInvoice(payingId, {
        amount: typeof payAmount === 'number' ? payAmount : undefined,
        method: payMethod,
        note: payNote,
      });
      toast.success('Payment recorded');
      setPaymentDialogOpen(false);
      setPayingId(null);
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const handleView = (id: string) => {
    setViewingId(id);
  };

  const viewedInvoice = financeInvoices.find((inv) => inv._id === viewingId);

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
            <h1 className="text-2xl font-bold">Finance & Accounting</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Invoice' : 'New Invoice'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Invoice #"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    required
                  />

                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as InvoiceType })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Related Purchase ID"
                    value={formData.relatedPurchaseId}
                    onChange={(e) => setFormData({ ...formData, relatedPurchaseId: e.target.value })}
                  />

                  <Input
                    placeholder="GRN Number"
                    value={formData.grnNumber}
                    onChange={(e) => setFormData({ ...formData, grnNumber: e.target.value })}
                  />

                  <Input
                    placeholder="Supplier Invoice #"
                    value={formData.supplierInvoiceNumber}
                    onChange={(e) => setFormData({ ...formData, supplierInvoiceNumber: e.target.value })}
                  />

                  <Input
                    placeholder="Amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    required
                  />

                  <Input
                    placeholder="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                <TableHead>Invoice #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.type}</TableCell>
                  <TableCell>{invoice.amount?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(invoice._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {invoice.status !== 'Paid' && (
                      <Button size="sm" variant="secondary" onClick={() => handleOpenPaymentDialog(invoice._id, invoice.amount)}>
                        <Check className="h-4 w-4" />
                        Pay
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(invoice)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeletingId(invoice._id);
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
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this invoice? This action cannot be undone.
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

          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Payment Amount"
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                />
                <Input
                  placeholder="Payment Method"
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                />
                <Input
                  placeholder="Note"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePaymentSubmit}>Save Payment</Button>
              </div>
            </DialogContent>
          </Dialog>

          {viewingId && (
            <Dialog open={Boolean(viewingId)} onOpenChange={() => setViewingId(null)}>
              <DialogContent className="max-w-[650px]">
                <DialogHeader>
                  <DialogTitle>Invoice Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Invoice #</div>
                    <div className="text-sm">{viewedInvoice?.invoiceNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm">{viewedInvoice?.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Amount</div>
                    <div className="text-sm">{viewedInvoice?.amount?.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">{viewedInvoice?.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm">{viewedInvoice?.dueDate ? new Date(viewedInvoice.dueDate).toLocaleDateString() : '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Related Purchase</div>
                    <div className="text-sm">{viewedInvoice?.relatedPurchaseId || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">GRN #</div>
                    <div className="text-sm">{viewedInvoice?.grnNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Supplier Invoice #</div>
                    <div className="text-sm">{viewedInvoice?.supplierInvoiceNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{viewedInvoice?.notes || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Payments</div>
                    <div className="text-sm">
                      {viewedInvoice?.payments?.length ? (
                        <ul className="list-disc pl-5">
                          {viewedInvoice.payments.map((payment, idx) => (
                            <li key={idx}>
                              {payment.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })} - {payment.method || 'N/A'} ({new Date(payment.date).toLocaleDateString()})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </div>
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

export default FinanceAccounting;

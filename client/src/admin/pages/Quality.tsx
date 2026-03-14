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
import { Plus, Pencil, Trash2, Check, X, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

const inspectionTypes = ['IQC', 'IPQC', 'FQC'] as const;
const statusOptions = ['PENDING', 'PASSED', 'FAILED', 'REWORK_REQUIRED', 'SCRAPPED'] as const;

type QualityStatus = (typeof statusOptions)[number];

type QualityResult = 'PASS' | 'FAIL';

interface InspectionItem {
  itemName: string;
  result: QualityResult;
  defects?: string[];
  notes?: string;
}

interface InspectionForm {
  inspectionNumber: string;
  inspectionType: (typeof inspectionTypes)[number];
  relatedId: string;
  inspector: string;
  inspectionDate: string;
  notes: string;
  items: InspectionItem[];
  defectReports: string[];
  nonConformanceReports: string[];
}

const Quality = () => {
  const {
    qualityInspections,
    loading,
    error,
    fetchQualityInspections,
    addQualityInspection,
    updateQualityInspection,
    deleteQualityInspection,
    updateInspectionStatus,
  } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const [formData, setFormData] = useState<InspectionForm>({
    inspectionNumber: '',
    inspectionType: 'IQC',
    relatedId: '',
    inspector: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    notes: '',
    items: [],
    defectReports: [],
    nonConformanceReports: [],
  });

  useEffect(() => {
    fetchQualityInspections();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      inspectionNumber: '',
      inspectionType: 'IQC',
      relatedId: '',
      inspector: '',
      inspectionDate: new Date().toISOString().split('T')[0],
      notes: '',
      items: [],
      defectReports: [],
      nonConformanceReports: [],
    });
    setEditingId(null);
  };

  const handleOpenDialog = (inspection?: typeof qualityInspections[number]) => {
    if (inspection) {
      setEditingId(inspection._id);
      setFormData({
        inspectionNumber: inspection.inspectionNumber,
        inspectionType: inspection.inspectionType,
        relatedId: inspection.relatedId || '',
        inspector: inspection.inspector || '',
        inspectionDate: inspection.inspectionDate ? inspection.inspectionDate.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: inspection.notes || '',
        items: inspection.items?.map((item) => ({
          itemName: item.itemName,
          result: item.result,
          defects: item.defects || [],
          notes: item.notes || '',
        })) || [],
        defectReports: inspection.defectReports || [],
        nonConformanceReports: inspection.nonConformanceReports || [],
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
        items: formData.items.map((item) => ({
          ...item,
          defects: item.defects || [],
        })),
      };

      if (editingId) {
        await updateQualityInspection(editingId, payload);
        toast.success('Inspection updated');
      } else {
        await addQualityInspection(payload);
        toast.success('Inspection created');
      }

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQualityInspection(id);
      toast.success('Inspection deleted');
    } catch (error) {
      toast.error('Failed to delete inspection');
    }
  };

  const handleUpdateStatus = async (id: string, status: QualityStatus, defectReports: string[] = []) => {
    try {
      await updateInspectionStatus(id, status, defectReports);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleView = (id: string) => {
    setViewingId(id);
  };

  const viewedInspection = useMemo(
    () => qualityInspections.find((i) => i._id === viewingId),
    [viewingId, qualityInspections]
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
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center py-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
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
            <h1 className="text-2xl font-bold">Quality Inspections</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Inspection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[950px]">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Inspection' : 'New Inspection'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Inspection Number"
                    value={formData.inspectionNumber}
                    onChange={(e) => setFormData({ ...formData, inspectionNumber: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Related Order / Batch ID"
                    value={formData.relatedId}
                    onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                  />
                  <Select
                    value={formData.inspectionType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, inspectionType: value as InspectionForm['inspectionType'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Inspection Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Inspector"
                    value={formData.inspector}
                    onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  />

                  <Input
                    placeholder="Inspection Date"
                    type="date"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Inspection Items</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            items: [
                              ...prev.items,
                              { itemName: '', result: 'PASS', defects: [], notes: '' },
                            ],
                          }))
                        }
                      >
                        Add Item
                      </Button>
                    </div>
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-end">
                        <Input
                          placeholder="Item"
                          value={item.itemName}
                          onChange={(e) => {
                            const updated = [...formData.items];
                            updated[index].itemName = e.target.value;
                            setFormData({ ...formData, items: updated });
                          }}
                        />
                        <Select
                          value={item.result}
                          onValueChange={(value) => {
                            const updated = [...formData.items];
                            updated[index].result = value as 'PASS' | 'FAIL';
                            setFormData({ ...formData, items: updated });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Result" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PASS">PASS</SelectItem>
                            <SelectItem value="FAIL">FAIL</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Defects (comma separated)"
                          value={(item.defects || []).join(', ')}
                          onChange={(e) => {
                            const updated = [...formData.items];
                            updated[index].defects = e.target.value
                              .split(',')
                              .map((d) => d.trim())
                              .filter(Boolean);
                            setFormData({ ...formData, items: updated });
                          }}
                        />
                        <Input
                          placeholder="Notes"
                          value={item.notes || ''}
                          onChange={(e) => {
                            const updated = [...formData.items];
                            updated[index].notes = e.target.value;
                            setFormData({ ...formData, items: updated });
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updated = formData.items.filter((_, i) => i !== index);
                            setFormData({ ...formData, items: updated });
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
                <TableHead>Inspection #</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualityInspections.map((inspection) => (
                <TableRow key={inspection._id}>
                  <TableCell>{inspection.inspectionNumber}</TableCell>
                  <TableCell>{inspection.inspectionType}</TableCell>
                  <TableCell>{inspection.status}</TableCell>
                  <TableCell>{inspection.inspector || '-'}</TableCell>
                  <TableCell>{new Date(inspection.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(inspection._id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(inspection)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUpdateStatus(inspection._id, 'PASSED')}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Pass
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(inspection._id, 'FAILED')}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Fail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(inspection._id, 'REWORK_REQUIRED')}
                    >
                      <RefreshCcw className="mr-1 h-4 w-4" />
                      Rework
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeletingId(inspection._id);
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
                <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this inspection? This action cannot be undone.
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
                  <DialogTitle>Inspection Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium">Inspection #</div>
                    <div className="text-sm">{viewedInspection?.inspectionNumber || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm">{viewedInspection?.inspectionType}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">{viewedInspection?.status}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Inspector</div>
                    <div className="text-sm">{viewedInspection?.inspector || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Inspection Date</div>
                    <div className="text-sm">
                      {viewedInspection?.inspectionDate
                        ? new Date(viewedInspection.inspectionDate).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Items</div>
                    <div className="text-sm">
                      {viewedInspection?.items && viewedInspection.items.length ? (
                        <ul className="list-disc pl-5">
                          {viewedInspection.items.map((item, idx) => (
                            <li key={idx}>
                              {item.itemName} - {item.result}
                              {item.defects && item.defects.length > 0 ? ` (Defects: ${item.defects.join(', ')})` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Defect Reports</div>
                    <div className="text-sm">
                      {viewedInspection?.defectReports && viewedInspection?.defectReports.length ? (
                        <ul className="list-disc pl-5">
                          {viewedInspection.defectReports.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{viewedInspection?.notes || '-'}</div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" onClick={() => setViewingId(null)}>
                    Close
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (viewedInspection) {
                        handleUpdateStatus(viewedInspection._id, 'PASSED');
                      }
                      setViewingId(null);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const defect = prompt('Describe defect(s)') || '';
                      if (viewedInspection) {
                        handleUpdateStatus(viewedInspection._id, 'FAILED', defect ? [defect] : []);
                      }
                      setViewingId(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const defect = prompt('Describe issue for rework') || '';
                      if (viewedInspection) {
                        handleUpdateStatus(viewedInspection._id, 'REWORK_REQUIRED', defect ? [defect] : []);
                      }
                      setViewingId(null);
                    }}
                  >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Rework
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

export default Quality;

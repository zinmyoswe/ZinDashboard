import { useEffect, useState } from 'react';
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
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

const Suppliers = () => {
  const { suppliers, loading, error, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier } =
    useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, '_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    contactPerson: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      contactPerson: '',
      imageUrl: '',
      isActive: true,
    });
    setEditingSupplier(null);
  };

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        country: supplier.country,
        contactPerson: supplier.contactPerson,
        imageUrl: supplier.imageUrl,
        isActive: supplier.isActive,
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
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, formData);
        toast.success('Supplier updated successfully!', { duration: 3000 });
      } else {
        const supplierWithId = { ...formData, _id: crypto.randomUUID() };
        await addSupplier(supplierWithId);
        toast.success('Supplier added successfully!', { duration: 3000 });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save supplier:', err);
      toast.error('Failed to save supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        toast.success('Supplier deleted successfully!', { duration: 3000 });
      } catch (err) {
        console.error('Failed to delete supplier:', err);
        toast.error('Failed to delete supplier. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <Input
                placeholder="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
              <Input
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
              <Input
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSupplier ? 'Update' : 'Add'} Supplier
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            {/* <TableHead>Address</TableHead> */}
            <TableHead>Contact Person</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier._id}>
              <TableCell>
                <img
                  src={supplier.imageUrl}
                  alt={supplier.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.country}</TableCell>
              {/* <TableCell>{supplier.address}</TableCell> */}
              <TableCell>{supplier.contactPerson}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(supplier)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Suppliers;
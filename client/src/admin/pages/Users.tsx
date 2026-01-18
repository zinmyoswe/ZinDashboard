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
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from "@/components/ui/spinner";
import defaultUserImage from '../../assets/defaultuser.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  _id: string;
  name: string;
  email: string;
  role: number;
  department: string;
  isActive: boolean;
  image: string;
}

const departments = [
  "SALES department",
  "MARKETING department",
  "WAREHOUSE department",
  "PURCHASING department",
  "LOGISTICS department",
  "FINANCE department",
  "ADMIN department"
];

const Users = () => {
  const { users, loading, error, fetchUsers, addUser, updateUser, deleteUser } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [formData, setFormData] = useState<Omit<User, '_id'>>({
    name: '',
    email: '',
    role: 0,
    department: '',
    isActive: true,
    image: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 0,
      department: '',
      isActive: true,
      image: '',
    });
    setEditingUser(null);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        isActive: user.isActive,
        image: user.image,
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
      if (editingUser) {
        await updateUser(editingUser._id, formData);
        toast.success('User updated successfully!', { duration: 3000 });
      } else {
        const userWithId = { ...formData, _id: crypto.randomUUID() };
        await addUser(userWithId);
        toast.success('User added successfully!', { duration: 3000 });
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save user:', err);
      toast.error('Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully!', { duration: 3000 });
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleViewDialog = (user: User) => {
    setViewingUser(user);
    setViewDialogOpen(true);
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
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4 items-center py-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
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
            <h1 className="text-2xl font-bold">Users</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
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
                    required
                  />
                  {!editingUser && (
                    <Input
                      placeholder="Password"
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  )}
                  <Select value={formData.role.toString()} onValueChange={(value) => setFormData({ ...formData, role: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Regular User</SelectItem>
                      <SelectItem value="1">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Spinner className="mr-2" />}
                      {editingUser ? 'Update' : 'Add'} User
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              {viewingUser && (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {viewingUser.name}</p>
                  <p><strong>Email:</strong> {viewingUser.email}</p>
                  <p><strong>Role:</strong> {viewingUser.role === 1 ? 'Admin' : 'Regular User'}</p>
                  <p><strong>Department:</strong> {viewingUser.department}</p>
                  <p><strong>Active:</strong> {viewingUser.isActive ? 'Yes' : 'No'}</p>
                  <p><strong>Image:</strong> <img src={viewingUser.image || defaultUserImage} alt={viewingUser.name} className="h-16 w-16 rounded-full object-cover" /></p>
                </div>
              )}
              <div className="flex justify-end">
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { if (deletingUserId) handleDelete(deletingUserId); setDeleteDialogOpen(false); }} className='bg-red-500'>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} onClick={() => handleViewDialog(user)} className="cursor-pointer">
                  <TableCell>
                    <img
                      src={user.image || defaultUserImage}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role === 1 ? 'Admin' : 'User'}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleViewDialog(user); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleOpenDialog(user); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setDeletingUserId(user._id); setDeleteDialogOpen(true); }}
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
      </div>
    </div>
  );
};

export default Users;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  imageUrl?: string;
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

const PurchaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { purchases, loading } = useAppContext();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundPurchase = purchases.find(p => p._id === id);
      setPurchase(foundPurchase || null);
    }
  }, [id, purchases]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!purchase) {
    return <div className="p-4">Purchase not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className='bg-muted/10 min-h-[100vh] flex-1 rounded-xl shadow-2xl md:min-h-min'>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Button variant="outline" onClick={() => navigate('/admin/purchases')} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Purchases
            </Button>
            <h1 className="text-2xl font-bold">Purchase Details</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold">Purchase Information</h2>
              <p><strong>Supplier:</strong> {purchase.supplierName}</p>
              <p><strong>Date:</strong> {new Date(purchase.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {purchase.status}</p>
              <p><strong>Total Amount:</strong> ${purchase.totalAmount.toFixed(2)}</p>
              {purchase.notes && <p><strong>Notes:</strong> {purchase.notes}</p>}
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4">Purchase Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchase.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetails;

import FinanceInvoice from '../model/FinanceInvoice.js';

// Get all finance invoices
export const getFinanceInvoices = async (req, res) => {
  try {
    const invoices = await FinanceInvoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single finance invoice
export const getFinanceInvoice = async (req, res) => {
  try {
    const invoice = await FinanceInvoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create invoice
export const createFinanceInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      type,
      relatedPurchaseId,
      grnNumber,
      supplierInvoiceNumber,
      amount,
      dueDate,
      status,
      notes,
    } = req.body;

    const invoice = new FinanceInvoice({
      invoiceNumber,
      type,
      relatedPurchaseId,
      grnNumber,
      supplierInvoiceNumber,
      amount,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status || 'Unpaid',
      notes,
      createdBy: req.user?._id,
    });

    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update invoice
export const updateFinanceInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      type,
      relatedPurchaseId,
      grnNumber,
      supplierInvoiceNumber,
      amount,
      dueDate,
      status,
      notes,
    } = req.body;

    const updateData = {
      invoiceNumber,
      type,
      relatedPurchaseId,
      grnNumber,
      supplierInvoiceNumber,
      amount,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status,
      notes,
    };

    const invoice = await FinanceInvoice.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete invoice
export const deleteFinanceInvoice = async (req, res) => {
  try {
    const invoice = await FinanceInvoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark invoice as paid (Finance only)
export const payFinanceInvoice = async (req, res) => {
  try {
    const { amount, method, note } = req.body;

    const invoice = await FinanceInvoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    invoice.status = 'Paid';
    invoice.payments.push({ amount: amount || invoice.amount, method, note });
    await invoice.save();

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

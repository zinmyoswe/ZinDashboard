import LogisticsShipment from '../model/LogisticsShipment.js';

export const getLogisticsShipments = async (req, res) => {
  try {
    const shipments = await LogisticsShipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLogisticsShipment = async (req, res) => {
  try {
    const shipment = await LogisticsShipment.findById(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Logistics shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLogisticsShipment = async (req, res) => {
  try {
    const { referenceId, carrierType, carrierName, scheduledDate, status, podUrl, notes } = req.body;

    const shipment = new LogisticsShipment({
      referenceId,
      carrierType,
      carrierName,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      status: status || 'Scheduled',
      podUrl,
      notes,
      createdBy: req.user?._id,
    });

    const savedShipment = await shipment.save();
    res.status(201).json(savedShipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLogisticsShipment = async (req, res) => {
  try {
    const { referenceId, carrierType, carrierName, scheduledDate, status, podUrl, notes } = req.body;

    const updateData = {
      referenceId,
      carrierType,
      carrierName,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      status,
      podUrl,
      notes,
    };

    const shipment = await LogisticsShipment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!shipment) return res.status(404).json({ message: 'Logistics shipment not found' });
    res.json(shipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLogisticsShipment = async (req, res) => {
  try {
    const shipment = await LogisticsShipment.findByIdAndDelete(req.params.id);
    if (!shipment) return res.status(404).json({ message: 'Logistics shipment not found' });
    res.json({ message: 'Logistics shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for Vedic Medicines
// Replace with DB logic as needed
let vedicMedicines = [
  {
    id: 1,
    name: 'Triphala Churna',
    type: 'Churna (Powder)',
    dose: { quantity: '5g', timing: 'A-0-A' },
    batch: 'TRP2024001',
    mfd: '2024-01-15',
    exp: '2026-01-15',
    unitPrice: 45.00,
    costPrice: 30.00,
    stock: 150,
    minStock: 50,
    maxStock: 500,
    status: 'In Stock',
    supplier: 'Himalaya Herbal',
    location: 'Rack A-1',
    lastRestocked: '2024-08-15',
    totalSold: 25,
    createdBy: 'Ancient Texts',
    description: 'Traditional Ayurvedic formulation for digestive health',
    properties: ['Digestive', 'Detoxifying', 'Antioxidant']
  },
  {
    id: 2,
    name: 'Ashwagandha Capsules',
    type: 'Capsule',
    dose: { quantity: '500mg', timing: 'B-B-B' },
    batch: 'ASH2024002',
    mfd: '2024-03-10',
    exp: '2025-03-10',
    unitPrice: 85.75,
    costPrice: 60.00,
    stock: 25,
    minStock: 50,
    maxStock: 300,
    status: 'Low Stock',
    supplier: 'Patanjali Ayurved',
    location: 'Rack B-2',
    lastRestocked: '2024-06-20',
    totalSold: 75,
    createdBy: 'Classical Texts',
    description: 'Adaptogenic herb for stress relief and vitality',
    properties: ['Adaptogenic', 'Stress Relief', 'Energy Booster']
  }
];

export const getAllVedicMedicines = (req, res) => {
  res.json({ success: true, data: vedicMedicines });
};

export const getVedicMedicineStats = (req, res) => {
  const totalMedicines = vedicMedicines.length;
  const lowStockMedicines = vedicMedicines.filter(m => m.status === 'Low Stock' || m.status === 'Critical Low').length;
  const expiredMedicines = vedicMedicines.filter(m => m.status === 'Expired').length;
  const totalInventoryValue = vedicMedicines.reduce((sum, m) => sum + (m.unitPrice * m.stock), 0);
  const totalCostValue = vedicMedicines.reduce((sum, m) => sum + (m.costPrice * m.stock), 0);

  res.json({
    success: true,
    data: {
      totalMedicines,
      vedicMedicines: totalMedicines,
      ownedMedicines: 0,
      lowStockMedicines,
      expiredMedicines,
      totalInventoryValue,
      totalCostValue,
      profitMargin: totalInventoryValue - totalCostValue
    }
  });
};

export const createVedicMedicine = (req, res) => {
  const newMed = { id: vedicMedicines.length + 1, ...req.body };
  vedicMedicines.push(newMed);
  res.status(201).json({ success: true, data: newMed });
};

export const updateVedicMedicine = (req, res) => {
  const idx = vedicMedicines.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Medicine not found' });
  vedicMedicines[idx] = { ...vedicMedicines[idx], ...req.body };
  res.json({ success: true, data: vedicMedicines[idx] });
};

export const deleteVedicMedicine = (req, res) => {
  const idx = vedicMedicines.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Medicine not found' });
  vedicMedicines.splice(idx, 1);
  res.json({ success: true, message: 'Medicine deleted' });
};
// Controller for Custom Medicines
// Replace with DB logic as needed
let customMedicines = [
  {
    id: 1,
    name: 'Dr. Sharma\'s Special Immunity Blend',
    type: 'Custom Formulation',
    dose: { quantity: '2 tablets', timing: 'A-0-A' },
    batch: 'DSS2024001',
    mfd: '2024-05-01',
    exp: '2025-05-01',
    unitPrice: 120.00,
    costPrice: 75.00,
    stock: 60,
    minStock: 25,
    maxStock: 150,
    status: 'In Stock',
    supplier: 'In-house Production',
    location: 'Rack F-1',
    lastRestocked: '2024-09-01',
    totalSold: 40,
    createdBy: 'Dr. Rajesh Sharma',
    description: 'Custom immunity formulation for seasonal wellness',
    properties: ['Immunity Booster', 'Seasonal Support', 'Antioxidant']
  },
  {
    id: 2,
    name: 'Patient-Specific Digestive Formula',
    type: 'Custom Mix',
    dose: { quantity: '1 tsp', timing: 'B-0-B' },
    batch: 'PSD2024001',
    mfd: '2024-06-15',
    exp: '2025-06-15',
    unitPrice: 95.00,
    costPrice: 60.00,
    stock: 35,
    minStock: 15,
    maxStock: 100,
    status: 'In Stock',
    supplier: 'Custom Pharmacy',
    location: 'Rack G-2',
    lastRestocked: '2024-08-20',
    totalSold: 12,
    createdBy: 'Patient Mr. Patel',
    description: 'Personalized digestive support blend',
    properties: ['Digestive Support', 'Personalized', 'Gentle Action']
  }
];

export const getAllCustomMedicines = (req, res) => {
  res.json({ success: true, data: customMedicines });
};

export const getCustomMedicineStats = (req, res) => {
  const totalMedicines = customMedicines.length;
  const lowStockMedicines = customMedicines.filter(m => m.status === 'Low Stock' || m.status === 'Critical Low').length;
  const expiredMedicines = customMedicines.filter(m => m.status === 'Expired').length;
  const totalInventoryValue = customMedicines.reduce((sum, m) => sum + (m.unitPrice * m.stock), 0);
  const totalCostValue = customMedicines.reduce((sum, m) => sum + (m.costPrice * m.stock), 0);

  res.json({
    success: true,
    data: {
      totalMedicines,
      vedicMedicines: 0,
      ownedMedicines: totalMedicines,
      lowStockMedicines,
      expiredMedicines,
      totalInventoryValue,
      totalCostValue,
      profitMargin: totalInventoryValue - totalCostValue
    }
  });
};

export const createCustomMedicine = (req, res) => {
  const newMed = { id: customMedicines.length + 1, ...req.body };
  customMedicines.push(newMed);
  res.status(201).json({ success: true, data: newMed });
};

export const updateCustomMedicine = (req, res) => {
  const idx = customMedicines.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Medicine not found' });
  customMedicines[idx] = { ...customMedicines[idx], ...req.body };
  res.json({ success: true, data: customMedicines[idx] });
};

export const deleteCustomMedicine = (req, res) => {
  const idx = customMedicines.findIndex(m => m.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Medicine not found' });
  customMedicines.splice(idx, 1);
  res.json({ success: true, message: 'Medicine deleted' });
};
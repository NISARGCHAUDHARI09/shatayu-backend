// Utility functions for managing draft medicine bills

// Save a draft bill to localStorage
export const saveDraftBill = (billData) => {
  try {
    const existingDrafts = getDraftBills();
    const newBill = {
      id: generateBillId(),
      ...billData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedDrafts = [newBill, ...existingDrafts];
    localStorage.setItem('draftMedicineBills', JSON.stringify(updatedDrafts));
    
    return newBill;
  } catch (error) {
    console.error('Error saving draft bill:', error);
    throw new Error('Failed to save draft bill');
  }
};

// Get all draft bills from localStorage
export const getDraftBills = () => {
  try {
    const drafts = localStorage.getItem('draftMedicineBills');
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error loading draft bills:', error);
    return [];
  }
};

// Update an existing draft bill
export const updateDraftBill = (billId, updatedData) => {
  try {
    const existingDrafts = getDraftBills();
    const updatedDrafts = existingDrafts.map(bill =>
      bill.id === billId
        ? { ...bill, ...updatedData, updatedAt: new Date().toISOString() }
        : bill
    );
    
    localStorage.setItem('draftMedicineBills', JSON.stringify(updatedDrafts));
    return updatedDrafts.find(bill => bill.id === billId);
  } catch (error) {
    console.error('Error updating draft bill:', error);
    throw new Error('Failed to update draft bill');
  }
};

// Delete a draft bill
export const deleteDraftBill = (billId) => {
  try {
    const existingDrafts = getDraftBills();
    const updatedDrafts = existingDrafts.filter(bill => bill.id !== billId);
    localStorage.setItem('draftMedicineBills', JSON.stringify(updatedDrafts));
    return true;
  } catch (error) {
    console.error('Error deleting draft bill:', error);
    throw new Error('Failed to delete draft bill');
  }
};

// Generate a unique bill ID
const generateBillId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `DB${timestamp}${random}`;
};

// Get draft bill by ID
export const getDraftBillById = (billId) => {
  try {
    const drafts = getDraftBills();
    return drafts.find(bill => bill.id === billId);
  } catch (error) {
    console.error('Error getting draft bill:', error);
    return null;
  }
};

// Mark draft as finalized
export const finalizeDraftBill = (billId) => {
  try {
    return updateDraftBill(billId, {
      status: 'finalized',
      finalizedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error finalizing draft bill:', error);
    throw new Error('Failed to finalize draft bill');
  }
};

// Send draft to pharmacy
export const sendDraftToPharmacy = (billId) => {
  try {
    return updateDraftBill(billId, {
      status: 'sent_to_pharmacy',
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending draft to pharmacy:', error);
    throw new Error('Failed to send draft to pharmacy');
  }
};

// Get draft bills statistics
export const getDraftBillsStats = () => {
  try {
    const drafts = getDraftBills();
    return {
      total: drafts.length,
      draft: drafts.filter(b => b.status === 'draft').length,
      finalized: drafts.filter(b => b.status === 'finalized').length,
      sent: drafts.filter(b => b.status === 'sent_to_pharmacy').length,
      totalValue: drafts.reduce((sum, bill) => {
        const billTotal = (bill.medicines || []).reduce((medSum, med) => {
          return medSum + (parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0));
        }, 0);
        return sum + billTotal;
      }, 0)
    };
  } catch (error) {
    console.error('Error getting draft bills stats:', error);
    return {
      total: 0,
      draft: 0,
      finalized: 0,
      sent: 0,
      totalValue: 0
    };
  }
};

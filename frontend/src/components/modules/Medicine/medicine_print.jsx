import React from 'react';

const MedicinePrint = ({ medicines = [], patientData = {}, onPrint }) => {
  // Default patient info if not provided
  const patientInfo = {
    name: patientData?.patientName || 'John Doe',
    caseId: patientData?.caseId || 'OPD001',
    age: patientData?.patientAge || '35',
    gender: patientData?.patientGender || 'Male',
    date: new Date().toLocaleDateString('en-IN'),
  };

  // Calculate total for billing
  const getTotal = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.unitPrice) || 0;
      const qty = parseFloat(med.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  // Hospital header and footer content
  const header = `SMART HOSPITAL & RESEARCH CENTER
Ayurvedic Medicine Department
123 Medical Street, Healthcare City - 400001
Phone: +91-9876543210 | Email: info@smarthospital.com
Registration No: MH/AYU/12345 | License No: AYU/2024/001`;

  const footer = `Dr. Rajesh Kumar, BAMS, MD (Ayu)
Chief Ayurvedic Physician
Signature: ________________________
This is a computer generated document.`;

  // Print function
  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <>
      {/* Print Button */}
      <button 
        className="medicine-print-button"
        onClick={handlePrint}
        style={{
          backgroundColor: '#319795',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        Print Medicine Documents
      </button>

      {/* Print Container - Hidden from UI, Only visible during print */}
      <div className="print-container" style={{ display: 'none' }}>
        
        {/* Page 1: Medicine List */}
        <div className="print-page print-page-1">
          <div className="print-header">
            <h1>SMART HOSPITAL & RESEARCH CENTER</h1>
            <p>Ayurvedic Medicine Department</p>
            <p>123 Medical Street, Healthcare City - 400001</p>
            <p>Phone: +91-9876543210 | Email: info@smarthospital.com</p>
            <p>Registration No: MH/AYU/12345 | License No: AYU/2024/001</p>
          </div>
          
          <div className="print-title">PRESCRIBED MEDICINES</div>
          
          <div className="print-patient-info">
            <div className="patient-row">
              <span><strong>Patient Name:</strong> {patientInfo.name}</span>
              <span><strong>Case ID:</strong> {patientInfo.caseId}</span>
            </div>
            <div className="patient-row">
              <span><strong>Age:</strong> {patientInfo.age} Years</span>
              <span><strong>Gender:</strong> {patientInfo.gender}</span>
            </div>
            <div className="patient-row">
              <span><strong>Date:</strong> {patientInfo.date}</span>
            </div>
          </div>
          
          <div className="print-body">
            <table className="medicine-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>S.No.</th>
                  <th style={{ width: '25%' }}>Medicine Name</th>
                  <th style={{ width: '18%' }}>Type</th>
                  <th style={{ width: '15%' }}>Dose</th>
                  <th style={{ width: '12%' }}>Anupana</th>
                  <th style={{ width: '12%' }}>Duration</th>
                  <th style={{ width: '10%' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', fontStyle: 'italic', padding: '30px' }}>
                      No medicines prescribed
                    </td>
                  </tr>
                ) : (
                  medicines.map((med, idx) => (
                    <tr key={med.id || idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td>{med.name}</td>
                      <td>{med.type}</td>
                      <td>{med.dose}</td>
                      <td>{med.anupana}</td>
                      <td>{med.duration}</td>
                      <td>{med.notes}</td>
                    </tr>
                  ))
                )}
                {/* Add empty rows to maintain consistent height */}
                {Array.from({ length: Math.max(0, 10 - medicines.length) }, (_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="print-footer">
            <p><strong>Dr. Rajesh Kumar, BAMS, MD (Ayu)</strong></p>
            <p>Chief Ayurvedic Physician</p>
            <p>Signature: ________________________</p>
            <p><em>This is a computer generated document.</em></p>
          </div>
        </div>

        {/* Page 2: Medicine Bill */}
        <div className="print-page print-page-2">
          <div className="print-header">
            <h1>SMART HOSPITAL & RESEARCH CENTER</h1>
            <p>Pharmacy Department</p>
            <p>123 Medical Street, Healthcare City - 400001</p>
            <p>Phone: +91-9876543210 | Email: pharmacy@smarthospital.com</p>
            <p>GSTIN: 27ABCDE1234F1Z5 | Drug License No: MH-2024-DRUG-001</p>
          </div>
          
          <div className="print-title">PHARMACY BILL</div>
          
          <div className="print-patient-info">
            <div className="patient-row">
              <span><strong>Patient Name:</strong> {patientInfo.name}</span>
              <span><strong>Bill No:</strong> BILL{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="patient-row">
              <span><strong>Case ID:</strong> {patientInfo.caseId}</span>
              <span><strong>Date:</strong> {patientInfo.date}</span>
            </div>
          </div>
          
          <div className="print-body">
            <table className="bill-table">
              <thead>
                <tr>
                  <th style={{ width: '8%' }}>S.No.</th>
                  <th style={{ width: '25%' }}>Medicine Name</th>
                  <th style={{ width: '12%' }}>Batch No.</th>
                  <th style={{ width: '10%' }}>MFD</th>
                  <th style={{ width: '10%' }}>EXP</th>
                  <th style={{ width: '12%' }}>Unit Price</th>
                  <th style={{ width: '8%' }}>Qty</th>
                  <th style={{ width: '15%' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {medicines.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', fontStyle: 'italic', padding: '30px' }}>
                      No medicines to bill
                    </td>
                  </tr>
                ) : (
                  medicines.map((med, idx) => (
                    <tr key={med.id || idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td>{med.name}</td>
                      <td style={{ textAlign: 'center' }}>{med.batchNo || 'B' + Math.random().toString().substr(2, 6)}</td>
                      <td style={{ textAlign: 'center' }}>{med.mfd}</td>
                      <td style={{ textAlign: 'center' }}>{med.exp}</td>
                      <td style={{ textAlign: 'right' }}>₹{parseFloat(med.unitPrice || 0).toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>{med.quantity}</td>
                      <td style={{ textAlign: 'right' }}>₹{(parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0)).toFixed(2)}</td>
                    </tr>
                  ))
                )}
                {/* Add empty rows to maintain consistent height */}
                {Array.from({ length: Math.max(0, 8 - medicines.length) }, (_, idx) => (
                  <tr key={`empty-bill-${idx}`}>
                    <td style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                    <td style={{ borderBottom: '1px solid #ddd' }}>&nbsp;</td>
                  </tr>
                ))}
                
                {/* Billing Summary */}
                <tr className="subtotal-row">
                  <td colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold', padding: '10px', borderTop: '2px solid #000' }}>SUB TOTAL:</td>
                  <td style={{ fontWeight: 'bold', textAlign: 'right', padding: '10px', borderTop: '2px solid #000' }}>₹{getTotal().toFixed(2)}</td>
                </tr>
                <tr className="tax-row">
                  <td colSpan="7" style={{ textAlign: 'right', padding: '8px' }}>CGST (9%):</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹{(getTotal() * 0.09).toFixed(2)}</td>
                </tr>
                <tr className="tax-row">
                  <td colSpan="7" style={{ textAlign: 'right', padding: '8px' }}>SGST (9%):</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹{(getTotal() * 0.09).toFixed(2)}</td>
                </tr>
                <tr className="discount-row">
                  <td colSpan="7" style={{ textAlign: 'right', padding: '8px' }}>Discount:</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>₹0.00</td>
                </tr>
                <tr className="total-row">
                  <td colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '16px', padding: '12px', backgroundColor: '#f0f0f0', borderTop: '2px solid #000' }}>GRAND TOTAL:</td>
                  <td style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'right', padding: '12px', backgroundColor: '#f0f0f0', borderTop: '2px solid #000' }}>₹{(getTotal() * 1.18).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="print-footer">
            <p><strong>Pharmacy In-charge: Mr. Suresh Patel</strong></p>
            <p>B.Pharm, Registered Pharmacist</p>
            <p>Signature: ________________________</p>
            <p><em>This is a computer generated bill. Terms & Conditions Apply.</em></p>
          </div>
        </div>
      </div>

      {/* Print-Only CSS */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          
          /* Hide everything first */
          body, body * {
            visibility: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Show only print container */
          .print-container, .print-container * {
            visibility: visible !important;
          }
          
          .print-container {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            background: white !important;
            z-index: 9999 !important;
          }
          
          .print-page {
            display: flex !important;
            flex-direction: column !important;
            min-height: 100vh !important;
            width: 100vw !important;
            background: white !important;
            padding: 25mm !important;
            box-sizing: border-box !important;
            color: black !important;
            font-family: Arial, sans-serif !important;
            position: relative !important;
          }
          
          .print-page-1 {
            page-break-after: always !important;
          }
          
          .print-page-2 {
            page-break-before: always !important;
          }
          
          .print-header {
            text-align: center !important;
            border-bottom: 3px solid black !important;
            padding-bottom: 15px !important;
            margin-bottom: 20px !important;
            flex-shrink: 0 !important;
          }
          
          .print-header h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            margin: 0 0 8px 0 !important;
            color: black !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
          }
          
          .print-header p {
            font-size: 11pt !important;
            margin: 3px 0 !important;
            color: black !important;
            line-height: 1.4 !important;
          }
          
          .print-title {
            font-size: 20pt !important;
            font-weight: bold !important;
            text-align: center !important;
            margin: 15px 0 20px 0 !important;
            color: black !important;
            text-decoration: underline !important;
            letter-spacing: 3px !important;
            flex-shrink: 0 !important;
          }
          
          .print-patient-info {
            background: #f8f8f8 !important;
            border: 2px solid black !important;
            padding: 12px !important;
            margin: 15px 0 !important;
            border-radius: 5px !important;
            flex-shrink: 0 !important;
          }
          
          .patient-row {
            display: flex !important;
            justify-content: space-between !important;
            margin: 5px 0 !important;
            font-size: 12pt !important;
            color: black !important;
          }
          
          .print-body {
            flex: 1 !important;
            margin: 15px 0 !important;
            min-height: 400px !important;
          }
          
          .medicine-table,
          .bill-table {
            width: 100% !important;
            border-collapse: collapse !important;
            border: 2px solid black !important;
            margin: 10px 0 !important;
          }
          
          .medicine-table th,
          .medicine-table td,
          .bill-table th,
          .bill-table td {
            border: 1px solid black !important;
            padding: 8px !important;
            text-align: left !important;
            font-size: 11pt !important;
            color: black !important;
            vertical-align: top !important;
          }
          
          .medicine-table th,
          .bill-table th {
            background: #e0e0e0 !important;
            font-weight: bold !important;
            text-align: center !important;
            font-size: 12pt !important;
          }
          
          .subtotal-row,
          .tax-row,
          .discount-row {
            background: #f5f5f5 !important;
          }
          
          .total-row {
            background: #e0e0e0 !important;
            font-weight: bold !important;
          }
          
          .print-footer {
            text-align: center !important;
            border-top: 2px solid black !important;
            padding-top: 15px !important;
            margin-top: auto !important;
            flex-shrink: 0 !important;
          }
          
          .print-footer p {
            font-size: 11pt !important;
            margin: 4px 0 !important;
            color: black !important;
            line-height: 1.3 !important;
          }
          
          /* Hide all UI elements completely */
          button,
          input,
          select,
          textarea,
          form,
          nav,
          header:not(.print-header),
          footer:not(.print-footer),
          .sidebar,
          .modal,
          .popover,
          .tooltip,
          script,
          style:not([media*="print"]) {
            display: none !important;
            visibility: hidden !important;
          }
        }
        
        @media screen {
          .print-container {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default MedicinePrint;

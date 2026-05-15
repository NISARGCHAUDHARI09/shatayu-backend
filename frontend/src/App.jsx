import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin imports
import AdminLayout from './portals/Admin/AdminLayout';
import AdminDashboard from './portals/Admin/AdminDashboard';
import PatientList from './components/modules/PatientManagement/PatientList';

import Reports from './components/modules/Reports/Reports';
import FinanceReports from './components/modules/Reports/FinanceReports';
import AppointmentReports from './components/modules/Reports/AppointmentReports';
import OPDReports from './components/modules/Reports/OPDReports';
import IPDReports from './components/modules/Reports/IPDReports';
import PharmacyReports from './components/modules/Reports/PharmacyReports';
import HRReports from './components/modules/Reports/HRReports';
import TPAReports from './components/modules/Reports/TPAReports';
import ConsultationReports from './components/modules/Reports/ConsultationReports';
import LogReports from './components/modules/Reports/LogReports';
import PatientReports from './components/modules/Reports/PatientReports';
import Setup from './components/modules/Setup/Setup';

// Admin module imports
import AppointmentManagement from './components/modules/AppointmentManagement/AppointmentManagement';
import OPD from './components/modules/OPD/OPD';
import PatientDetails from './components/modules/OPD/PatientDetails';
import IPD from './components/modules/IPD/IPD';
import BillingManagement from './components/modules/BillingManagement/BillingManagement';
import Draft from './components/modules/Draft/Draft';
import HumanResources from './components/modules/HumanResources/HumanResources';
import DutyRoster from './components/modules/DutyRoster/DutyRoster';
import AnnualCalendar from './components/modules/AnnualCalendar/AnnualCalendar';
import TPAManagement from './components/modules/TPAManagement/TPAManagement';
import Finance from './components/modules/Finance/Finance';
import Income from './components/modules/Finance/Income';
import Expense from './components/modules/Finance/Expense';
import Messaging from './components/modules/Messaging/Messaging';
import Inventory from './components/modules/Inventory/Inventory';
import MedicineManagement from './components/modules/MedicineManagement/MedicineManagement';
import DownloadCenter from './components/modules/DownloadCenter/DownloadCenter';
import InsuranceDocumentation from './components/modules/InsuranceDocumentation/InsuranceDocumentation';
import LiveConsultation from './components/modules/LiveConsultation/LiveConsultation';

// Doctor imports
import DoctorLayout from './portals/Doctor/DoctorLayout';
import OPDDoctor from './components/modules/OPD/OPD';
import IPDDoctor from './components/modules/IPD/IPD';
import PatientOverviewPage from './portals/Doctor/pages/PatientOverviewPage';
import BillingManagementDoctor from './components/modules/BillingManagement/BillingManagement';
import DoctorDraft from './portals/Doctor/pages/DoctorDraft';
import DoctorMessaging from './portals/Doctor/pages/DoctorMessaging';
import DoctorStaffManagement from './components/modules/StaffManagement/DoctorStaffManagement';
import SetupPage from './portals/Doctor/pages/SetupPage';
import Login from './pages/Login';

function App() {
  // Redirect root path to /login if needed
  if (window.location.pathname === '/') {
    window.location.replace('/login');
    return null;
  }
  return (
    <AuthProvider>
      <>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="opd" element={<OPD />} />
              <Route path="patient-details/:id" element={<PatientDetails />} />
              <Route path="ipd" element={<IPD />} />
              <Route path="billing" element={<BillingManagement />} />
              <Route path="draft" element={<Draft />} />
              <Route path="hr" element={<HumanResources />} />
              <Route path="duty-roster" element={<DutyRoster />} />
              <Route path="calendar" element={<AnnualCalendar />} />
              <Route path="tpa" element={<TPAManagement />} />
              <Route path="finance" element={<Finance />} />
              <Route path="finance/income" element={<Income />} />
              <Route path="finance/expense" element={<Expense />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="medicine-management" element={<MedicineManagement />} />
              <Route path="downloads" element={<DownloadCenter />} />
              <Route path="insurance-docs" element={<InsuranceDocumentation />} />
              <Route path="live-consultation" element={<LiveConsultation />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/finance" element={<FinanceReports />} />
              <Route path="reports/appointment" element={<AppointmentReports />} />
              <Route path="reports/opd" element={<OPDReports />} />
              <Route path="reports/ipd" element={<IPDReports />} />
              <Route path="reports/pharmacy" element={<PharmacyReports />} />
              <Route path="reports/hr" element={<HRReports />} />
              <Route path="reports/tpa" element={<TPAReports />} />
              <Route path="reports/consultation" element={<ConsultationReports />} />
              <Route path="reports/logs" element={<LogReports />} />
              <Route path="reports/patient" element={<PatientReports />} />
              <Route path="setup" element={<Setup />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor/*" element={<ProtectedRoute requiredRole="doctor"><DoctorLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="opd" replace />} />
              <Route path="opd" element={<OPDDoctor />} />
              <Route path="patient-details/:id" element={<PatientDetails />} />
              <Route path="ipd" element={<IPDDoctor />} />
              <Route path="patients" element={<PatientOverviewPage />} />
              <Route path="patient-overview" element={<PatientOverviewPage />} />
              <Route path="billing" element={<BillingManagementDoctor />} />
              <Route path="draft" element={<DoctorDraft />} />
              <Route path="messaging" element={<DoctorMessaging />} />
              <Route path="staff-management" element={<DoctorStaffManagement />} />
              <Route path="setup" element={<SetupPage />} />
              <Route path="medicine-management" element={<MedicineManagement />} />
              <Route path="live-consultation" element={<LiveConsultation />} />
              <Route path="live-consultation/meeting" element={<LiveConsultation />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="calendar" element={<AnnualCalendar />} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient" element={<ProtectedRoute requiredRole="patient"><div>Patient Portal</div></ProtectedRoute>} />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />
          </Routes>

          {/* Footer: only show if not on login page */}
          {window.location.pathname !== '/login' && (
            <footer className="footer" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#1e3a5f',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              position: 'fixed',
              left: 0,
              bottom: 0,
              width: '100%',
              zIndex: 100,
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
              <p style={{margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
                © 2025 <strong>AyurNova</strong> — A product by
                <img src="/LOGO.jpg" alt="Avyam Labs" style={{height: '20px', verticalAlign: 'middle', borderRadius: '50%'}} />
                <span>Avyam Labs</span>
              </p>
            </footer>
          )}
        </Router>
      </>
    </AuthProvider>
  );
}

export default App;

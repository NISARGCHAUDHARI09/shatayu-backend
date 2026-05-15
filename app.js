const express = require('express');
const app = express();

app.use(express.json());
const patientRoutes = require('./routes/patientroutes');
app.use('/api/patients', patientRoutes);
const ipdActionsRoutes = require('./routes/ipdactionsroutes');
app.use('/api/ipd-actions', ipdActionsRoutes);
const panchkarmaRoutes = require('./routes/panchkarmaroutes');
app.use('/api/panchkarma', panchkarmaRoutes);
const ipdRoutes = require('./routes/ipdroutes');
app.use('/api/ipd', ipdRoutes);
const medicineBillRoutes = require('./routes/medicinebillroutes');
app.use('/api/medicine-bills', medicineBillRoutes);

// Import OPD routes
const opdRoutes = require('./routes/opdroutes');
app.use('/api/opd-patients', opdRoutes);

// Import Prescription routes
const prescriptionRoutes = require('./routes/prescriptionroutes');
app.use('/api/prescriptions', prescriptionRoutes);

// Import Staff routes
const staffRoutes = require('./routes/staffroutes');
app.use('/api/staff', staffRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Shatayu Hospital Backend Running');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

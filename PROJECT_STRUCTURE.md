# Project Structure

This project has been reorganized into frontend and backend folders.

## Directory Structure

```
shatayu software/
├── frontend/           # React + Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   ├── index.html     # Entry HTML
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js + Express backend API
│   ├── controller/    # API controllers
│   ├── routes/        # API routes
│   ├── index.js       # Server entry point
│   └── package.json   # Backend dependencies
└── package.json       # Root scripts

```

## Running the Application

### Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Port 5002)
```bash
cd backend
npm install
npm start
```

### From Root Directory
```bash
# Run frontend
npm run dev

# Run backend
npm run backend
```

## API Endpoints

### Medicine Management
- Vedic Medicines: `http://localhost:5002/api/medicines/vedic`
- Custom Medicines: `http://localhost:5002/api/medicines/custom`
- Inventory: `http://localhost:5002/api/inventory`
- Staff: `http://localhost:5002/api/staff`
- Events: `http://localhost:5002/api/events`

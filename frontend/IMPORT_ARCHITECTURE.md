# Patient Import Feature - Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Chakra UI)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              File Upload Component                        │  │
│  │  • File Input (.csv, .xlsx, .xls)                        │  │
│  │  • Import Button with Loading State                      │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              File Parser (XLSX.js)                        │  │
│  │  • Read workbook                                          │  │
│  │  • Extract headers                                        │  │
│  │  • Parse rows to JSON                                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Header Validation & Mapping                      │  │
│  │  • Check required columns exist                           │  │
│  │  • Map to standard field names                            │  │
│  │  • Case-insensitive matching                              │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Row Validation                                │  │
│  │  • Filter empty rows                                      │  │
│  │  • Validate required fields (name, phone)                 │  │
│  │  • Track skipped rows                                     │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │             Chunk Processor                               │  │
│  │  • Split data into chunks (200 records)                   │  │
│  │  • Initialize AbortController                             │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│         ┌───────────┴────────────┐                              │
│         ▼                        ▼                              │
│  ┌─────────────┐          ┌─────────────┐                      │
│  │  Progress   │          │  Chunk      │                      │
│  │  Bar UI     │◄─────────┤  Uploader   │                      │
│  │             │          │  + Retry    │                      │
│  │  Shows:     │          │  Logic      │                      │
│  │  • %        │          └──────┬──────┘                      │
│  │  • Count    │                 │                              │
│  │  • Cancel   │                 │                              │
│  └─────────────┘                 │                              │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │  HTTP POST   │  JWT Token   │
                    │  (Axios)     │  in Headers  │
                    └──────────────┼──────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           JWT Authentication Middleware                   │  │
│  │  • Verify Bearer token                                    │  │
│  │  • Decode user information                                │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │       POST /api/patients/import                           │  │
│  │  • Receive chunk of patients                              │  │
│  │  • Validate data                                          │  │
│  │  • Process business logic                                 │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Database Operations                             │  │
│  │  • Insert/Update patient records                          │  │
│  │  • Transaction handling                                   │  │
│  │  • Return success/error                                   │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│  • Patients Table                                                │
│  • Indexed on patientId, phone, email                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Import Process Flow

```
START
  │
  ▼
┌─────────────────────┐
│ User selects file   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Read file with      │
│ FileReader API      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Parse with XLSX.js  │
│ Extract headers     │
│ Convert to JSON     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Validate headers    │───► Missing required?──Yes──► Show error
└──────────┬──────────┘                                    │
           │ No                                            │
           ▼                                               │
┌─────────────────────┐                                    │
│ Map row data to     │                                    │
│ patient objects     │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ▼                                               │
┌─────────────────────┐                                    │
│ Validate each row   │                                    │
│ • Name required     │                                    │
│ • Phone required    │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ├──► Invalid?──Yes──► Skip row, track error    │
           │                                               │
           │ Valid                                         │
           ▼                                               │
┌─────────────────────┐                                    │
│ Split into chunks   │                                    │
│ (200 per chunk)     │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ▼                                               │
     FOR EACH CHUNK                                        │
           │                                               │
           ▼                                               │
┌─────────────────────┐                                    │
│ Check if cancelled? │───Yes──► Abort & cleanup          │
└──────────┬──────────┘                                    │
           │ No                                            │
           ▼                                               │
┌─────────────────────┐                                    │
│ POST chunk to API   │                                    │
│ with JWT token      │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ├──► Success?──Yes──► Update progress          │
           │                     Increment count           │
           │                     Continue to next          │
           │                                               │
           │ No (Failed)                                   │
           ▼                                               │
┌─────────────────────┐                                    │
│ Retry attempt #1    │                                    │
│ Wait 1 second       │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ├──► Success?──Yes──► Update progress          │
           │                                               │
           │ No                                            │
           ▼                                               │
┌─────────────────────┐                                    │
│ Retry attempt #2    │                                    │
│ Wait 2 seconds      │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ├──► Success?──Yes──► Update progress          │
           │                                               │
           │ No                                            │
           ▼                                               │
┌─────────────────────┐                                    │
│ Retry attempt #3    │                                    │
│ Wait 4 seconds      │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ├──► Success?──Yes──► Update progress          │
           │                                               │
           │ No (All retries failed)                       │
           ▼                                               │
┌─────────────────────┐                                    │
│ Mark chunk failed   │                                    │
│ Track row numbers   │                                    │
│ Continue next chunk │                                    │
└──────────┬──────────┘                                    │
           │                                               │
     END FOR EACH                                          │
           │                                               │
           ▼                                               │
┌─────────────────────┐                                    │
│ Refresh patient     │                                    │
│ list from API       │                                    │
└──────────┬──────────┘                                    │
           │                                               │
           ▼                                               │
┌─────────────────────┐                                    │
│ Show summary modal  │◄───────────────────────────────────┘
│ • Total             │
│ • Imported          │
│ • Failed            │
│ • Skipped           │
│ • Error list        │
└──────────┬──────────┘
           │
           ▼
          END
```

---

## 🎯 State Management Flow

```
Initial State:
  importing: false
  importProgress: 0
  importStatus: ''
  importStats: { total: 0, imported: 0, failed: 0, skipped: 0 }
  importErrors: []
  abortController: null

      │
      ▼ (User clicks Import)
      
File Selected:
  importing: true ──────────────► Show progress bar
  importStatus: 'processing'
  abortController: new AbortController()

      │
      ▼ (Each chunk processed)
      
During Upload:
  importProgress: 0 → 20 → 40 → 60 → 80 → 100
  importStats.imported: 0 → 200 → 400 → 600 → 800 → 1000
  importStats.failed: tracks failed records
  importErrors: accumulates error messages

      │
      ▼ (Upload completes)
      
Completion:
  importing: false ─────────────► Hide progress bar
  importStatus: 'complete'
  abortController: null
  
  IF errors exist:
    Show summary modal ──────────► User reviews details
  ELSE:
    Show success toast

      │
      ▼
      
Ready for Next Import:
  (State resets for next operation)
```

---

## 🔐 Security Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. User logs in
       ▼
┌─────────────┐
│   Backend   │
└──────┬──────┘
       │
       │ 2. Returns JWT token
       ▼
┌─────────────┐
│ localStorage│  token stored
└──────┬──────┘
       │
       │ 3. Import file selected
       ▼
┌─────────────┐
│   Client    │  Reads token from localStorage
└──────┬──────┘
       │
       │ 4. POST /api/patients/import
       │    Headers: { Authorization: 'Bearer <token>' }
       ▼
┌─────────────┐
│   Backend   │  Verifies JWT
└──────┬──────┘
       │
       ├──► Invalid/Expired? → 401 Unauthorized
       │
       │ Valid
       ▼
┌─────────────┐
│  Process    │  Import data
│  & Store    │
└──────┬──────┘
       │
       │ 5. Return success
       ▼
┌─────────────┐
│   Client    │  Show confirmation
└─────────────┘
```

---

## 📦 Component Structure

```
PatientList.jsx
├── State Hooks
│   ├── importing (boolean)
│   ├── importProgress (0-100)
│   ├── importStatus (string)
│   ├── importStats (object)
│   ├── importErrors (array)
│   └── abortController (AbortController)
│
├── Functions
│   ├── fieldMappings (column mapping config)
│   ├── mapRowToPatient (row mapper)
│   ├── validatePatient (validation logic)
│   ├── retryWithBackoff (retry mechanism)
│   ├── handleCancelImport (cancellation handler)
│   └── handleImportPatients (main import handler)
│
└── UI Components
    ├── Import Button + File Input
    ├── Progress Bar (conditional)
    │   ├── Progress component
    │   ├── Percentage display
    │   ├── Count display
    │   └── Cancel button
    │
    └── Summary Modal (conditional)
        ├── Statistics Grid
        │   ├── Imported count (green)
        │   ├── Failed count (red)
        │   ├── Skipped count (orange)
        │   └── Total count (blue)
        │
        ├── Error List (if errors exist)
        │   ├── Alert header
        │   ├── Scrollable list
        │   └── "...and N more" indicator
        │
        └── Success Alert (if no errors)
```

---

## 🔄 Retry Logic - Exponential Backoff

```
Attempt 1:
  ├─ Try upload
  └─ Failed ─► Wait 1s (1000ms)

Attempt 2:
  ├─ Try upload
  └─ Failed ─► Wait 2s (2000ms)

Attempt 3:
  ├─ Try upload
  └─ Failed ─► Wait 4s (4000ms)

Final Attempt:
  ├─ Try upload
  ├─ Success ─► Continue
  └─ Failed ─► Mark chunk as failed, continue to next

Formula: delay = baseDelay * 2^attempt
  Attempt 0: 1000 * 2^0 = 1000ms (1s)
  Attempt 1: 1000 * 2^1 = 2000ms (2s)
  Attempt 2: 1000 * 2^2 = 4000ms (4s)
```

---

## 📊 Data Transformation Pipeline

```
CSV/Excel File
      │
      ▼
Raw Cell Data
  "John Doe", "9876543210", "35", ...
      │
      ▼
JSON Array (from XLSX)
  [{ "Name": "John Doe", "Phone": "9876543210", "Age": "35" }, ...]
      │
      ▼
Mapped Patient Objects
  [{ name: "John Doe", phone: "9876543210", age: "35" }, ...]
      │
      ▼
Validated Objects (with errors filtered)
  Valid: [{ name: "John Doe", phone: "9876543210", age: "35" }]
  Errors: ["Row 5: Missing phone number"]
      │
      ▼
Chunked Arrays
  Chunk 1: [patient1, patient2, ..., patient200]
  Chunk 2: [patient201, patient202, ..., patient400]
  ...
      │
      ▼
API Payload
  { patients: [chunk data] }
      │
      ▼
Database Records
  Patient table rows with IDs, timestamps, etc.
```

---

## 🎨 UI State Transitions

```
Idle State:
  ┌─────────────────────────┐
  │  Import Patients Button │
  │  Export Button          │
  └─────────────────────────┘

      │ (Click Import)
      ▼

Uploading State:
  ┌─────────────────────────────────────┐
  │  Import Patients Button (Loading)   │
  │  Export Button                       │
  ├─────────────────────────────────────┤
  │  ┌───────────────────────────────┐  │
  │  │ Importing patients...      [X]│  │
  │  │ 400 / 1000                    │  │
  │  │ ████████████░░░░░░░░░░░       │  │
  │  │ 40% complete                  │  │
  │  └───────────────────────────────┘  │
  └─────────────────────────────────────┘

      │ (Upload completes)
      ▼

Complete State (with errors):
  ┌─────────────────────────────────────┐
  │        Import Summary Modal          │
  ├─────────────────────────────────────┤
  │  ┌──────────┐ ┌──────────┐         │
  │  │ ✓ 950    │ │ ✗ 30     │         │
  │  │ Imported │ │ Failed   │         │
  │  └──────────┘ └──────────┘         │
  │  ┌──────────┐ ┌──────────┐         │
  │  │ ⚠ 20     │ │ Σ 1000   │         │
  │  │ Skipped  │ │ Total    │         │
  │  └──────────┘ └──────────┘         │
  │                                      │
  │  ⚠ Issues Found:                    │
  │  • Row 15: Missing phone number     │
  │  • Row 23: Missing phone number     │
  │  • Row 45: Failed to import         │
  │  ...                                 │
  │                                      │
  │         [Close Button]               │
  └─────────────────────────────────────┘

      │ (Click Close)
      ▼

Back to Idle State
```

This architecture ensures robust, user-friendly bulk patient import! 🚀
